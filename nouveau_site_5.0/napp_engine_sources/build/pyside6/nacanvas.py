"""
NaCanvas Engine for NaCode (PySide6)
Provides high-level 2D drawing and low-level OpenGL triangle rendering.
"""

import array
from typing import Any, List, Optional, Tuple

# pylint: disable=no-name-in-module, invalid-name, too-many-arguments, too-many-positional-arguments

from PySide6.QtWidgets import QWidget
from PySide6.QtGui import QPainter, QColor, QBrush, QPen, QImage
from PySide6.QtCore import Qt, QRectF, QPointF, QSize, Signal
from PySide6.QtOpenGLWidgets import QOpenGLWidget
from PySide6.QtOpenGL import QOpenGLShaderProgram, QOpenGLBuffer, QOpenGLShader

class NaCanvas2D(QWidget):
    """
    PySide6 implementation of the high-level 2D canvas.
    Uses an internal QImage to persist drawing commands.
    """

    mouse_down = Signal(float, float)
    mouse_up = Signal(float, float)
    mouse_move = Signal(float, float)

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self._image: QImage = QImage(QSize(800, 600), QImage.Format.Format_ARGB32_Premultiplied)
        self._image.fill(Qt.GlobalColor.white)
        self.setMinimumSize(100, 100)

    def resizeEvent(self, event: Any) -> None:
        """Handles widget resize events."""
        super().resizeEvent(event)
        new_size = event.size()
        if (
            new_size.width() > self._image.width()
            or new_size.height() > self._image.height()
        ):
            new_img = QImage(new_size, QImage.Format.Format_ARGB32_Premultiplied)
            new_img.fill(Qt.GlobalColor.white)
            painter = QPainter(new_img)
            painter.drawImage(0, 0, self._image)
            painter.end()
            self._image = new_img

    def mousePressEvent(self, event: Any) -> None:
        """Emits mouse_down signal."""
        pos = event.position()
        print(f"[NaCanvas2D] Mouse Down at {pos.x()}, {pos.y()}")
        self.mouse_down.emit(pos.x(), pos.y())

    def mouseReleaseEvent(self, event: Any) -> None:
        """Emits mouse_up signal."""
        pos = event.position()
        self.mouse_up.emit(pos.x(), pos.y())

    def mouseMoveEvent(self, event: Any) -> None:
        """Emits mouse_move signal."""
        pos = event.position()
        self.mouse_move.emit(pos.x(), pos.y())

    def paintEvent(self, event: Any) -> None:
        """Handles widget paint events."""
        _ = event
        painter = QPainter(self)
        painter.drawImage(0, 0, self._image)
        painter.end()

    def clear(self, color: str = "white") -> None:
        """Clears the canvas with a solid color."""
        self._image.fill(QColor(color))
        self.update()

    def draw_polygon(self, points: List[Any], color: str = "black", fill: bool = True) -> None:
        """Draws a polygon from a list of points."""
        painter = QPainter(self._image)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        qpoints = []
        for p in points:
            if isinstance(p, (list, tuple)):
                qpoints.append(QPointF(float(p[0]), float(p[1])))
            else:
                qpoints.append(QPointF(float(p.x), float(p.y)))

        if fill:
            painter.setBrush(QBrush(QColor(color)))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawPolygon(qpoints)
        else:
            painter.setBrush(Qt.BrushStyle.NoBrush)
            painter.setPen(QPen(QColor(color)))
            painter.drawPolygon(qpoints)

        painter.end()
        self.update()

    def draw_ellipse(self, x: float, y: float, rx: float, ry: float, color: str = "black", fill: bool = True) -> None:
        """Draws an ellipse at (x, y) with radii (rx, ry)."""
        painter = QPainter(self._image)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        rect = QRectF(x - rx, y - ry, rx * 2, ry * 2)

        if fill:
            painter.setBrush(QBrush(QColor(color)))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawEllipse(rect)
        else:
            painter.setBrush(Qt.BrushStyle.NoBrush)
            painter.setPen(QPen(QColor(color)))
            painter.drawEllipse(rect)

        painter.end()
        self.update()

    def draw_rounded_rect(self, x: float, y: float, w: float, h: float, r: float, color: str = "black", fill: bool = True) -> None:
        """Draws a rounded rectangle."""
        painter = QPainter(self._image)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        rect = QRectF(x, y, w, h)

        if fill:
            painter.setBrush(QBrush(QColor(color)))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawRoundedRect(rect, r, r)
        else:
            painter.setBrush(Qt.BrushStyle.NoBrush)
            painter.setPen(QPen(QColor(color)))
            painter.drawRoundedRect(rect, r, r)

        painter.end()
        self.update()

    def draw_sprite(self, src: str, x: float, y: float, w: Optional[float] = None, h: Optional[float] = None) -> None:
        """Draws an image at (x, y) with optional scaling (w, h)."""
        if src.startswith("res://"):
            src = src.replace("res://", "res/")

        img = QImage(src)
        if img.isNull():
            return

        painter = QPainter(self._image)
        if w is not None and h is not None:
            painter.drawImage(QRectF(x, y, w, h), img)
        else:
            painter.drawImage(QPointF(x, y), img)
        painter.end()
        self.update()


class NaCanvasGL(QOpenGLWidget):
    """
    Real OpenGL backend for PySide6 with VBOs and custom shader support.
    """

    mouse_down = Signal(float, float)
    mouse_up = Signal(float, float)
    mouse_move = Signal(float, float)

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setMinimumSize(100, 100)
        self._clear_color: Tuple[float, float, float, float] = (1.0, 1.0, 1.0, 1.0)
        self._program: Optional[QOpenGLShaderProgram] = None
        self._vbo: Optional[QOpenGLBuffer] = None
        self._initialized: bool = False
        self._gl: Any = None
        self._draw_calls: List[Tuple[List[float], dict[str, Any]]] = []

    def mousePressEvent(self, event: Any) -> None:
        """Emits mouse_down signal."""
        pos = event.position()
        print(f"[NaCanvasGL] Mouse Down at {pos.x()}, {pos.y()}")
        self.mouse_down.emit(pos.x(), pos.y())

    def mouseReleaseEvent(self, event: Any) -> None:
        """Emits mouse_up signal."""
        pos = event.position()
        self.mouse_up.emit(pos.x(), pos.y())

    def mouseMoveEvent(self, event: Any) -> None:
        """Emits mouse_move signal."""
        pos = event.position()
        self.mouse_move.emit(pos.x(), pos.y())

    def initializeGL(self) -> None:
        """Initializes OpenGL context and resources."""
        self._gl = self.context().functions()
        self._gl.glEnable(0x0B71)  # GL_DEPTH_TEST

        # Default shader program
        self._program = QOpenGLShaderProgram(self)
        self._setup_default_shaders()

        # VBO
        self._vbo = QOpenGLBuffer(QOpenGLBuffer.Type.VertexBuffer)
        self._vbo.create()

        self._initialized = True

    def _setup_default_shaders(self) -> None:
        """Sets up the default shader program."""
        if not self._program:
            return
        vshader = """attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
"""
        fshader = """#ifdef GL_ES
precision mediump float;
#endif
uniform vec4 u_color;
void main() {
    gl_FragColor = u_color;
}
"""
        self._program.addShaderFromSourceCode(QOpenGLShader.ShaderTypeBit.Vertex, vshader.strip())
        self._program.addShaderFromSourceCode(QOpenGLShader.ShaderTypeBit.Fragment, fshader.strip())
        self._program.link()

    def set_shader(self, vs_source: str, fs_source: str) -> None:
        """Compiles and sets a custom shader program."""
        self.makeCurrent()
        new_program = QOpenGLShaderProgram(self)
        if not new_program.addShaderFromSourceCode(
            QOpenGLShader.ShaderTypeBit.Vertex, vs_source.strip()
        ):
            print("[NaCanvasGL] Vertex shader error:", new_program.log())
            return
        if not new_program.addShaderFromSourceCode(
            QOpenGLShader.ShaderTypeBit.Fragment, fs_source.strip()
        ):
            print("[NaCanvasGL] Fragment shader error:", new_program.log())
            return
        if not new_program.link():
            print("[NaCanvasGL] Link error:", new_program.log())
            return

        self._program = new_program
        self.doneCurrent()
        self.update()

    def paintGL(self) -> None:
        """Executes drawing calls in the OpenGL context."""
        if not self._initialized or not self._program or not self._vbo:
            return

        self._gl.glClearColor(*self._clear_color)
        self._gl.glClear(
            0x00004000 | 0x00000100
        )  # GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT

        if not self._program.bind():
            return

        for vertices, options in self._draw_calls:
            # Update VBO
            v_data = array.array('f', vertices)
            self._vbo.bind()
            # Use buffer interface
            self._vbo.allocate(v_data.tobytes(), len(vertices) * 4)

            # Set attributes
            pos_loc = self._program.attributeLocation("a_position")
            if pos_loc != -1:
                self._program.enableAttributeArray(pos_loc)
                self._program.setAttributeBuffer(
                    pos_loc, 0x1406, 0, 2
                )  # GL_FLOAT, 2 components

            # Set uniforms
            color = options.get("color", [0.0, 0.0, 0.0, 1.0])
            # Use uniformLocation to get int handle
            u_loc = self._program.uniformLocation("u_color")
            if u_loc != -1:
                self._program.setUniformValue(u_loc, float(color[0]), float(color[1]), float(color[2]), float(color[3]))

            # Draw
            self._gl.glDrawArrays(0x0004, 0, len(vertices) // 2)  # GL_TRIANGLES

            if pos_loc != -1:
                self._program.disableAttributeArray(pos_loc)
            self._vbo.release()

        self._program.release()

    def clear(self, r: float = 1.0, g: float = 1.0, b: float = 1.0, a: float = 1.0) -> None:
        """Clears the OpenGL surface."""
        self._clear_color = (r, g, b, a)
        self._draw_calls = []
        self.update()

    def draw_triangles(self, vertices: List[float], options: Optional[dict[str, Any]] = None) -> None:
        """Records a triangle drawing call."""
        self._draw_calls.append((vertices, options or {}))
        self.update()
