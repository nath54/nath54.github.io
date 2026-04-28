from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLayout, 
    QLabel, QPushButton, QFrame, QScrollArea, QLineEdit, QGridLayout, QPlainTextEdit
)
from PySide6.QtCore import Qt, QSize
from PySide6.QtGui import QPixmap, QFont
from napp_runtime import gs, ResponsiveGridWidget, RandomManifestWidget
from nascene_engine import NaSceneWidget
from nacanvas import NaCanvas2D, NaCanvasGL
from logic.app_logic import *
import asyncio

class Pages_blogWindow(QMainWindow):
    def __init__(self, buffer):
        super().__init__()
        self.buffer = buffer
        self.setWindowTitle('Pages_blogWindow')
        self.resize(800, 600)

        # 1. Run main logic if it exists (Initializes state)
        if 'main' in globals():
            import inspect
            if inspect.iscoroutinefunction(main):
                asyncio.ensure_future(main())
            else:
                main()

        # 2. Setup UI
        self.setup_ui()

        # 3. Setup Bindings
        self.setup_bindings()

    def setup_ui(self):
        self.scroll_area_1 = QScrollArea()
        self.scroll_area_1.setWidgetResizable(True)
        self.setCentralWidget(self.scroll_area_1)
        self.content_container_2 = QWidget()
        self.scroll_area_1.setWidget(self.content_container_2)
        self.root_layout_2 = QVBoxLayout(self.content_container_2)
        self.main_container_3 = QWidget()
        self.main_container_3.setObjectName('main_container')
        self.main_container_layout_4 = QVBoxLayout(self.main_container_3)
        self.main_container_layout_4.setContentsMargins(0, 0, 0, 0)
        self.div_5 = QWidget()
        self.div_5.setObjectName('div')
        self.div_5.setProperty('class', 'layout-single-column')
        self.main_container_layout_4.addWidget(self.div_5)
        self.script_6 = QWidget()
        self.script_6.setObjectName('script')
        self.main_container_layout_4.addWidget(self.script_6)
        self.root_layout_2.addWidget(self.main_container_3)
        self.root_layout_2.addStretch()

    def setup_bindings(self):
        pass