"""
NaScene Engine for PySide6.
Handles visual novel style interpretation and rendering.
"""

# pylint: disable=no-name-in-module

import asyncio
import os
import re
from typing import Any, Dict, List, Optional
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QGraphicsOpacityEffect
from PySide6.QtGui import QPixmap, QMouseEvent, QResizeEvent
from PySide6.QtCore import Qt


class NaSceneInterrupt(Exception):
    """Exception raised to interrupt scene execution (e.g. jump)."""


class NaSceneEnd(Exception):
    """Exception raised when a scene ends naturally or via command."""


class NaSceneWidget(QFrame):
    """
    Interpretation component for NaScene scripts in PySide6.
    """

    def __init__(self, buffer: Any, parent: Optional[QFrame] = None) -> None:
        super().__init__(parent)
        self.buffer = buffer
        self.scenes: Dict[str, List[Dict[str, Any]]] = {}
        self.elements: Dict[str, Dict[str, Any]] = {}
        self.run_id: int = 0
        self.is_paused: bool = False
        self._pause_future: Optional[asyncio.Future[bool]] = None

        # Style the container
        self.setFrameShape(QFrame.Shape.StyledPanel)
        self.setMinimumHeight(300)
        self.setStyleSheet("background-color: black; border-radius: 10px;")

        # System variables (simplified for now)
        self.sys_vars: Dict[str, bool] = {
            "sys_is_landscape": True,
            "sys_is_portrait": False,
        }

    def set_scenes(self, scenes: Dict[str, List[Dict[str, Any]]]) -> None:
        """Loads scene data into the engine."""
        self.scenes = scenes

    async def start(self, scene_id: str) -> None:
        """Starts a scene by ID."""
        self.run_id += 1
        await self.play_scene(scene_id, self.run_id)

    def evaluate_string(self, text: str) -> str:
        """Resolves $variables in strings using the reactive buffer."""
        if not isinstance(text, str):
            return str(text)

        def replace_var(match: re.Match[str]) -> str:
            var_name = match.group(1)
            # Check buffer state
            val = self.buffer.get(var_name)
            if val is not None:
                return str(val)
            # Fallback to state prefix if needed
            val = self.buffer.get(f"state.{var_name}")
            if val is not None:
                return str(val)
            if var_name in self.sys_vars:
                return str(self.sys_vars[var_name])
            return str(match.group(0))

        return re.sub(r"\$(\w+)", replace_var, text)

    async def execute_command(self, cmd: Dict[str, Any]) -> None:
        """Executes a single NaScene command."""
        name = cmd["command"]
        args = cmd["args"]

        if name == "clear":
            for data in self.elements.values():
                data["widget"].deleteLater()
            self.elements = {}

        elif name == "add_image":
            self._handle_add_image(args)

        elif name == "add_text":
            self._handle_add_text(args)

        elif name == "add_choice":
            self._handle_add_choice(args)

        elif name.startswith("set_var_"):
            var_name = args.get("var_name")
            value = args.get("value")
            # Set in root buffer (will propagate to state and root due to flattening)
            self.buffer.set(var_name, value)

        elif name == "pause":
            self.is_paused = True
            self._pause_future = asyncio.get_event_loop().create_future()
            await self._pause_future

        elif name == "jump":
            target = args.get("target")
            await self.start(target)
            raise NaSceneInterrupt()

        elif name == "end":
            raise NaSceneEnd()

    def _handle_add_image(self, args: Dict[str, Any]) -> None:
        """Adds an image element to the scene."""
        label = QLabel(self)
        src = self.evaluate_string(args.get("src", ""))
        if os.path.exists(src):
            pixmap = QPixmap(src)
            label.setPixmap(pixmap)
            fit = args.get("object_fit", "cover")
            if fit == "contain":
                label.setScaledContents(False)
                label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            else:
                label.setScaledContents(True)
        self._apply_geometry(label, args)
        label.show()
        item_id = args.get("id", f"gen_{len(self.elements)}")
        self.elements[item_id] = {"widget": label, "args": args}

    def _handle_add_text(self, args: Dict[str, Any]) -> None:
        """Adds a text element to the scene."""
        label = QLabel(self)
        label.setText(self.evaluate_string(args.get("text", "")))
        label.setStyleSheet(
            f"color: {args.get('color', 'white')}; font-size: {args.get('font_size', 14)}px;"
        )
        self._apply_geometry(label, args)
        label.show()
        item_id = args.get("id", f"gen_{len(self.elements)}")
        self.elements[item_id] = {"widget": label, "args": args}

    def _handle_add_choice(self, args: Dict[str, Any]) -> None:
        """Adds a choice button to the scene."""
        btn = QPushButton(self.evaluate_string(args.get("text", "Choice")), self)
        target_scene = args.get("target")
        btn.setStyleSheet(
            "background-color: rgba(40, 40, 40, 200); color: white; "
            "border: 1px solid #777; border-radius: 4px; padding: 8px;"
        )

        def make_handler(t: str) -> Any:
            return lambda: asyncio.ensure_future(self.start(t))

        btn.clicked.connect(make_handler(str(target_scene)))
        self._apply_geometry(btn, args)
        btn.show()
        item_id = args.get("id", f"gen_{len(self.elements)}")
        self.elements[item_id] = {"widget": btn, "args": args}

    def mousePressEvent(self, event: QMouseEvent) -> None:  # pylint: disable=invalid-name
        """Handle mouse clicks to advance text or finish animations."""
        if self.is_paused and self._pause_future:
            self.is_paused = False
            self._pause_future.set_result(True)
            self._pause_future = None
        super().mousePressEvent(event)

    def resizeEvent(self, event: QResizeEvent) -> None:  # pylint: disable=invalid-name
        """
        Handle responsive re-calculation of element positions.
        """
        super().resizeEvent(event)
        for data in self.elements.values():
            self._apply_geometry(data["widget"], data["args"])

    def _apply_geometry(self, widget: Any, args: Dict[str, Any]) -> None:
        # Normalized coordinates 0.0 to 1.0
        parent_w = float(self.width())
        parent_h = float(self.height())

        pos_x = float(args.get("pos_x", 0.0)) * parent_w
        pos_y = float(args.get("pos_y", 0.0)) * parent_h

        # Size parsing (default to auto if not specified)
        size_x_raw = str(args.get("size_x", "auto"))
        size_y_raw = str(args.get("size_y", "auto"))

        # If it's a label, we can try to adjust size first for 'auto'
        is_auto_x = size_x_raw == "auto"
        is_auto_y = size_y_raw == "auto"

        if is_auto_x or is_auto_y:
            widget.adjustSize()
            w = float(widget.width())
            h = float(widget.height())
        else:
            w = 100.0
            h = 100.0

        if "px" in size_x_raw:
            w = float(size_x_raw.replace("px", ""))
        elif "%" in size_x_raw:
            w = float(float(size_x_raw.replace("%", "")) / 100 * parent_w)

        if "px" in size_y_raw:
            h = float(size_y_raw.replace("px", ""))
        elif "%" in size_y_raw:
            h = float(float(size_y_raw.replace("%", "")) / 100 * parent_h)

        # Anchor
        ax = float(args.get("anchor_x", 0.0))
        ay = float(args.get("anchor_y", 0.0))

        # Scale
        sx = float(args.get("scale_x", 1.0))
        sy = float(args.get("scale_y", 1.0))
        w *= sx
        h *= sy

        widget.resize(int(w), int(h))
        widget.move(int(pos_x - ax * w), int(pos_y - ay * h))

        # Opacity
        opacity = float(args.get("opacity", 1.0))
        if opacity < 1.0:
            effect = QGraphicsOpacityEffect(widget)
            effect.setOpacity(opacity)
            widget.setGraphicsEffect(effect)
        else:
            widget.setGraphicsEffect(None)

    async def play_scene(self, scene_id: str, run_id: int) -> None:
        """Executes a scene command list sequentially."""
        cmds = self.scenes.get(scene_id, [])
        for cmd in cmds:
            if self.run_id != run_id:
                break
            try:
                await self.execute_command(cmd)
            except NaSceneInterrupt:
                break
            except NaSceneEnd:
                break
            except Exception as e:  # pylint: disable=broad-exception-caught
                print(f"NaScene Runtime Error: {e}")
