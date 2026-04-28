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
import webbrowser

class Pages_museumWindow(QMainWindow):
    def __init__(self, buffer):
        super().__init__()
        self.buffer = buffer
        self.setWindowTitle('Pages_museumWindow')
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
        self.single_column_5 = QWidget()
        self.single_column_5.setObjectName('single_column')
        self.single_column_layout_6 = QVBoxLayout(self.single_column_5)
        self.single_column_layout_6.setContentsMargins(0, 0, 0, 0)
        self.title_text_7 = QLabel()
        self.title_text_7.setWordWrap(True)
        self.title_text_7.setObjectName('title_text')
        self.title_text_7.setText('The Museum')
        self.single_column_layout_6.addWidget(self.title_text_7)
        self.text_8 = QLabel()
        self.text_8.setWordWrap(True)
        self.text_8.setObjectName('text')
        self.text_8.setText('Choose a gallery to visit.')
        self.single_column_layout_6.addWidget(self.text_8)
        self.nascene_9 = NaSceneWidget(self.buffer)
        self.nascene_9.set_scenes(self.buffer.get('data.'))
        asyncio.ensure_future(self.nascene_9.start('start'))
        self.single_column_layout_6.addWidget(self.nascene_9)
        self.main_container_layout_4.addWidget(self.single_column_5)
        self.root_layout_2.addWidget(self.main_container_3)
        self.root_layout_2.addStretch()

    def setup_bindings(self):
        pass