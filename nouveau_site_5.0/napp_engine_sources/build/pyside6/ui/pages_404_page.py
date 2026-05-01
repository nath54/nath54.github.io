from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLayout, 
    QLabel, QPushButton, QFrame, QScrollArea, QLineEdit, QGridLayout, QPlainTextEdit
)
from PySide6.QtCore import Qt, QSize
from PySide6.QtGui import QPixmap, QFont, QIcon
from napp_runtime import gs, ResponsiveGridWidget, RandomManifestWidget, ExpandableNodeWidget
from nascene_engine import NaSceneWidget
from nacanvas import NaCanvas2D, NaCanvasGL
from logic.app_logic import *
import asyncio
import webbrowser
import os

class Pages_404Window(QMainWindow):
    def __init__(self, buffer):
        super().__init__()
        self.buffer = buffer
        self.setWindowTitle('Pages_404Window')
        self.resize(1024, 768)
        if not self.buffer.get('current_page'):
            self.buffer.set('current_page', 'pages_404')

        self.setup_ui()
        self.setup_bindings()

    def setup_ui(self):
        main_widget = QWidget()
        main_widget.setObjectName('main_container')
        self.setCentralWidget(main_widget)
        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        # OS Title Bar
        os_title_bar = QWidget()
        os_title_bar.setObjectName('os_title_bar')
        os_title_layout = QHBoxLayout(os_title_bar)
        os_title_layout.setContentsMargins(10, 0, 10, 0)
        os_btn_back = QPushButton('← Back')
        os_btn_back.setObjectName('os_btn_back')
        os_btn_back.clicked.connect(lambda: gs.navigate('pages_index'))
        os_title_layout.addWidget(os_btn_back)
        os_title_layout.addStretch()
        display_title = self.windowTitle().replace('_', ' ').replace('Window', '').replace('Pages ', '')
        os_title_label = QLabel(display_title)
        os_title_label.setObjectName('os_title')
        os_title_layout.addWidget(os_title_label)
        os_title_layout.addStretch()
        os_controls = QWidget()
        os_controls.setObjectName('os_controls')
        os_controls_layout = QHBoxLayout(os_controls)
        os_controls_layout.setContentsMargins(0, 0, 0, 0)
        os_controls_layout.setSpacing(8)
        dot_min = QLabel()
        dot_min.setObjectName('os_btn_min')
        os_controls_layout.addWidget(dot_min)
        dot_max = QLabel()
        dot_max.setObjectName('os_btn_max')
        os_controls_layout.addWidget(dot_max)
        dot_close = QLabel()
        dot_close.setObjectName('os_btn_close')
        os_controls_layout.addWidget(dot_close)
        os_title_layout.addWidget(os_controls)
        self.centralWidget().layout().addWidget(os_title_bar)
        self.scroll_area_1 = QScrollArea()
        self.scroll_area_1.setWidgetResizable(True)
        self.scroll_area_1.setAlignment(Qt.AlignCenter)
        main_layout.addWidget(self.scroll_area_1)
        self.content_container_2 = QWidget()
        self.content_container_2.setObjectName('content_container')
        self.content_container_2.setMaximumWidth(1200)
        self.scroll_area_1.setWidget(self.content_container_2)
        self.root_layout_2 = QVBoxLayout(self.content_container_2)
        self.root_layout_2.setContentsMargins(60, 40, 60, 40)
        self.root_layout_2.setSpacing(30)
        self.main_container_3 = QWidget()
        self.main_container_3.setObjectName('main_container')
        self.main_container_layout_4 = QVBoxLayout(self.main_container_3)
        self.main_container_layout_4.setContentsMargins(30, 20, 30, 20)
        self.main_container_layout_4.setSpacing(15)
        self.single_column_5 = QWidget()
        self.single_column_5.setObjectName('single_column')
        self.single_column_layout_6 = QVBoxLayout(self.single_column_5)
        self.single_column_layout_6.setContentsMargins(0, 0, 0, 0)
        self.single_column_layout_6.setSpacing(15)
        self.title_text_7 = QLabel()
        self.title_text_7.setWordWrap(True)
        self.title_text_7.setObjectName('title_text')
        self.title_text_7.setText('404 - Page Not Found')
        self.title_text_7.setProperty('class', 'title-text')
        self.single_column_layout_6.addWidget(self.title_text_7)
        self.text_8 = QLabel()
        self.text_8.setWordWrap(True)
        self.text_8.setObjectName('text')
        self.text_8.setText('The page you are looking for does not exist.')
        self.text_8.setProperty('class', 'text')
        self.single_column_layout_6.addWidget(self.text_8)
        self.link_page_9 = QPushButton()
        self.link_page_9.setObjectName('link_page')
        self.link_page_9.setText('Back to Home')
        if os.path.exists('res/icons/home.png'):
            self.link_page_9.setIcon(QIcon('res/icons/home.png'))
        self.link_page_9.setText('Back to Home')
        self.link_page_9.clicked.connect(lambda _, p='index': gs.navigate(p))
        self.link_page_9.setProperty('class', 'link-page')
        self.single_column_layout_6.addWidget(self.link_page_9)
        self.single_column_layout_6.addStretch()
        self.single_column_5.setProperty('class', 'single-column')
        self.main_container_layout_4.addWidget(self.single_column_5)
        self.main_container_layout_4.addStretch()
        self.main_container_3.setProperty('class', 'main-container')
        self.root_layout_2.addWidget(self.main_container_3)
        self.root_layout_2.addStretch()

    def setup_bindings(self):
        pass