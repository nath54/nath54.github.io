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

    def __init__(
        self,
        buffer: Any,
        options: Optional[Dict[str, Any]] = None,
        parent: Optional[QFrame] = None,
    ) -> None:
        super().__init__(parent)
        self.buffer = buffer
        options = options or {}
        self.scenes: Dict[str, List[Dict[str, Any]]] = options.get("scenes", {})
        self.manifest: Dict[str, Any] = options.get("manifest", {})
        self.base_data: Dict[str, Any] = options.get("baseData", {})

        self.elements: Dict[str, Dict[str, Any]] = {}
        self.run_id: int = 0
        self.is_paused: bool = False
        self._pause_future: Optional[asyncio.Future[bool]] = None

        self.bar: Optional[QFrame] = None
        self.bar_text: Optional[QLabel] = None

        # Style the container
        self.setFrameShape(QFrame.Shape.StyledPanel)
        self.setMinimumHeight(300)
        self.setStyleSheet("background-color: black; border-radius: 10px;")

        # System variables
        self.sys_vars: Dict[str, Any] = {
            "sys_is_landscape": True,
            "sys_is_portrait": False,
        }

    def set_scenes(self, scenes: Dict[str, List[Dict[str, Any]]]) -> None:
        """Loads scene data into the engine."""
        self.scenes = scenes

    async def load_manifest(self) -> None:
        """Resolves the manifest landing place and starts the scene."""
        if not self.manifest or "landing_place" not in self.manifest:
            return

        landing = self.manifest["landing_place"]
        # format: nascene_root:/path/to/file.nascene:scene_id
        last_colon = landing.rfind(":")
        if last_colon == -1:
            return

        full_path = landing[:last_colon]
        start_scene = landing[last_colon + 1 :]

        raw_path = full_path.replace("nascene_root:", "")
        data_key = raw_path.replace(".nascene", "").lstrip("/").replace("/", ".")

        # Navigate data buffer
        current = self.base_data or {}
        if not current:
            # Fallback to full data if baseData is missing
            current = self.buffer.get("data") or {}

        path_parts = data_key.split(".")
        for p in path_parts:
            if isinstance(current, dict) and p in current:
                current = current[p]
            else:
                break

        self.scenes = current
        # If we just loaded a manifest-like dict into scenes, try to find the actual script
        if isinstance(self.scenes, dict) and landing in self.scenes:
            # Wrap the list in a dict to match the expected type and prevent runtime errors in play_scene
            self.scenes = {start_scene: self.scenes[landing]}
        elif isinstance(self.scenes, dict) and "landing_place" in self.scenes:
            # We probably loaded the manifest.json instead of the .nascene file
            # Fallback: look for the .nascene sibling
            sibling_key = raw_path.lstrip("/")
            if sibling_key in self.base_data:
                self.scenes = self.base_data[sibling_key]
            elif data_key in self.base_data:
                self.scenes = self.base_data[data_key]

        await self.start(start_scene)

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
            val = self.buffer.get(var_name)
            if val is not None:
                return str(val)
            val = self.buffer.get(f"state.{var_name}")
            if val is not None:
                return str(val)
            if var_name in self.sys_vars:
                return str(self.sys_vars[var_name])
            return str(match.group(0))

        return re.sub(r"\$(\w+)", replace_var, text)

    def _ensure_bar(self) -> None:
        """Lazily creates the dialogue bar."""
        if self.bar:
            return

        self.bar = QFrame(self)
        self.bar.setObjectName("nascene-bar")
        # Fixed position at bottom
        self.bar.setStyleSheet(
            "background-color: rgba(20, 20, 20, 220); border-top: 2px solid #444; color: white;"
        )

        self.bar_text = QLabel(self.bar)
        self.bar_text.setWordWrap(True)
        self.bar_text.setAlignment(
            Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignTop
        )
        self.bar_text.setStyleSheet("font-size: 16px; padding: 10px; border: none;")
        self.bar_text.setText("")

        self.bar.show()
        self._resize_bar()

    def _resize_bar(self) -> None:
        if self.bar and self.bar_text:
            h = 120
            self.bar.setGeometry(0, self.height() - h, self.width(), h)
            self.bar_text.setGeometry(10, 10, self.width() - 20, h - 20)

    async def execute_command(self, cmd: Dict[str, Any]) -> None:
        """Executes a single NaScene command."""
        name = cmd["command"]
        args = cmd["args"]
        lang = self.buffer.get("language") or "en"

        if name == "clear":
            for data in self.elements.values():
                data["widget"].deleteLater()
            self.elements = {}
            if self.bar:
                self.bar.hide()

        elif name == "bar_show":
            self._ensure_bar()
            if self.bar:
                self.bar.show()

        elif name == "bar_hide":
            if self.bar:
                self.bar.hide()

        elif name == "bar_clear":
            if self.bar_text:
                self.bar_text.setText("")

        elif name == "bar_append_text":
            self._ensure_bar()
            text = args.get(f"text_{lang}") or args.get("text") or ""
            if self.bar_text:
                current = self.bar_text.text()
                self.bar_text.setText(current + self.evaluate_string(text))

        elif name == "add_image":
            self._handle_add_image(args)

        elif name == "add_text":
            self._handle_add_text(args)

        elif name == "add_choice":
            self._handle_add_choice(args)

        elif name == "add_button":
            # Add button is similar to add_choice but more generic
            self._handle_add_button(args)

        elif name == "load_var":
            var_name = args.get("var_name")
            default = args.get("default_value")
            if self.buffer.get(var_name) is None:
                self.buffer.set(var_name, default)

        elif name == "save_var":
            var_name = args.get("var_name")
            value = args.get("value")
            self.buffer.set(var_name, value)

        elif name == "clear_var":
            var_name = args.get("var_name")
            self.buffer.set(var_name, None)

        elif name == "if":
            cond_var = args.get("cond_var_name")
            val = self.buffer.get(cond_var)
            if val:
                target = args.get("true_scene_name")
            else:
                target = args.get("false_scene_name")
            if target:
                await self.start(target)
                raise NaSceneInterrupt()

        elif name == "pause":
            self.is_paused = True
            self._pause_future = asyncio.get_event_loop().create_future()
            await self._pause_future

        elif name in ("jump", "goto"):
            target = args.get("target") or args.get("scene_name")
            await self.start(target)
            raise NaSceneInterrupt()

        elif name == "end":
            raise NaSceneEnd()

    def _handle_add_image(self, args: Dict[str, Any]) -> None:
        """Adds an image element to the scene."""
        label = QLabel(self)
        src = self.evaluate_string(args.get("src", ""))

        # In PySide6, paths are relative to the executable/cwd
        # We might need to resolve 'res/' prefix
        if src.startswith("res/"):
            pass  # Keep as is, usually copied to dist

        if os.path.exists(src):
            pixmap = QPixmap(src)
            label.setPixmap(pixmap)
            fit = args.get("object_fit", "cover")
            if fit == "contain":
                label.setScaledContents(False)
                label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            else:
                label.setScaledContents(True)

        if args.get("position_and_size") == "fullscreen":
            label.setGeometry(0, 0, self.width(), self.height())
            label.setScaledContents(True)
        else:
            self._apply_geometry(label, args)

        label.show()
        item_id = args.get("id", f"gen_{len(self.elements)}")
        self.elements[item_id] = {"widget": label, "args": args}

    def _handle_add_text(self, args: Dict[str, Any]) -> None:
        """Adds a text element to the scene."""
        label = QLabel(self)
        lang = self.buffer.get("language") or "en"
        text = args.get(f"text_{lang}") or args.get("text", "")
        label.setText(self.evaluate_string(text))
        label.setStyleSheet(
            f"color: {args.get('color', 'white')}; font-size: {args.get('font_size', 14)}px;"
        )
        self._apply_geometry(label, args)
        label.show()
        item_id = args.get("id", f"gen_{len(self.elements)}")
        self.elements[item_id] = {"widget": label, "args": args}

    def _handle_add_choice(self, args: Dict[str, Any]) -> None:
        """Adds a choice button to the scene."""
        lang = self.buffer.get("language") or "en"
        text = args.get(f"text_{lang}") or args.get("text", "Choice")
        btn = QPushButton(self.evaluate_string(text), self)
        target_scene = args.get("target") or args.get("target_scene")
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

    def _handle_add_button(self, args: Dict[str, Any]) -> None:
        """Generic button handler."""
        # For now, it behaves like add_choice
        self._handle_add_choice(args)

    def mousePressEvent(self, event: QMouseEvent) -> None:  # pylint: disable=invalid-name
        """Handle mouse clicks to advance text or finish animations."""
        if self.is_paused and self._pause_future:
            self.is_paused = False
            if not self._pause_future.done():
                self._pause_future.set_result(True)
            self._pause_future = None
        super().mousePressEvent(event)

    def resizeEvent(self, event: QResizeEvent) -> None:  # pylint: disable=invalid-name
        """
        Handle responsive re-calculation of element positions.
        """
        super().resizeEvent(event)
        self._resize_bar()
        for data in self.elements.values():
            if data["args"].get("position_and_size") == "fullscreen":
                data["widget"].setGeometry(0, 0, self.width(), self.height())
            else:
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
        cmds = self.scenes.get(scene_id, []) if self.scenes else []
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
