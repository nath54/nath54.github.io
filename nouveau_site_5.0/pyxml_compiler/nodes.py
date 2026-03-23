"""AST node types for the PyXML language.

Defines the data structures that represent the parsed PyXML tree:
- PyxmlNode: an element node with tag, attributes, and children
- TextNode: a plain text node
- CommentNode: an XML comment (ignored during compilation)
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TextNode:
    """A plain text node in the PyXML AST."""

    text: str


@dataclass
class CommentNode:
    """An XML comment node. Ignored during compilation."""

    text: str


@dataclass
class PyxmlNode:
    """An element node in the PyXML AST.

    Represents a PyXML tag with its attributes and children.
    Children can be PyxmlNode, TextNode, or CommentNode instances.
    """

    tag: str
    attributes: dict[str, str] = field(default_factory=dict)
    children: list[PyxmlNode | TextNode | CommentNode] = field(default_factory=list)


def is_execution_block(tag: str) -> bool:
    """Check whether a tag name corresponds to an execution block.

    Execution blocks have tags starting with 'exec_' (e.g. exec_generate,
    exec_foreach, exec_if, exec_include, exec_markdown).

    Args:
        tag: The tag name to check.

    Returns:
        True if the tag is an execution block.
    """
    return tag.startswith("exec_")
