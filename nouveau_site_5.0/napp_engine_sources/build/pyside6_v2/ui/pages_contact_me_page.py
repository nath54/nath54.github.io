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

class Pages_contact_meWindow(QMainWindow):
    def __init__(self, buffer):
        super().__init__()
        self.buffer = buffer
        self.setWindowTitle('Pages_contact_meWindow')
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
        self.title_text_7.setText('Contact Me')
        self.single_column_layout_6.addWidget(self.title_text_7)
        self.section_8 = QWidget()
        self.section_8.setObjectName('section')
        self.section_layout_9 = QVBoxLayout(self.section_8)
        self.section_layout_9.setContentsMargins(0, 0, 0, 0)
        self.text_10 = QLabel()
        self.text_10.setWordWrap(True)
        self.text_10.setObjectName('text')
        self.text_10.setText('If you want to reach out for professional inquiries, for a collaboration, or just to say hi, here are the best ways of contacting me:')
        self.section_layout_9.addWidget(self.text_10)
        self.subsection_11 = QWidget()
        self.subsection_11.setObjectName('subsection')
        self.subsection_layout_12 = QVBoxLayout(self.subsection_11)
        self.subsection_layout_12.setContentsMargins(0, 0, 0, 0)
        self.text_13 = QLabel()
        self.text_13.setWordWrap(True)
        self.text_13.setObjectName('text')
        self.text_13.setText('By sending an email to:')
        self.subsection_layout_12.addWidget(self.text_13)
        self.code_14 = QWidget()
        self.code_14.setObjectName('code')
        self.subsection_layout_12.addWidget(self.code_14)
        self.section_layout_9.addWidget(self.subsection_11)
        self.subsection_15 = QWidget()
        self.subsection_15.setObjectName('subsection')
        self.subsection_layout_16 = QVBoxLayout(self.subsection_15)
        self.subsection_layout_16.setContentsMargins(0, 0, 0, 0)
        self.text_17 = QLabel()
        self.text_17.setWordWrap(True)
        self.text_17.setObjectName('text')
        self.text_17.setText('Or by sending a message on Linkedin:')
        self.subsection_layout_16.addWidget(self.text_17)
        self.link_url_18 = QLabel()
        self.link_url_18.setWordWrap(True)
        self.link_url_18.setObjectName('link_url')
        self.subsection_layout_16.addWidget(self.link_url_18)
        self.section_layout_9.addWidget(self.subsection_15)
        self.single_column_layout_6.addWidget(self.section_8)
        self.main_container_layout_4.addWidget(self.single_column_5)
        self.root_layout_2.addWidget(self.main_container_3)
        self.root_layout_2.addStretch()

    def setup_bindings(self):
        pass