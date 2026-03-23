"""PyXML parser — converts PyXML source text into an AST of nodes.

PyXML is XML-based, so we use Python's xml.etree.ElementTree to parse it.
We wrap the content in a root <_pyxml_root> tag to handle multiple
top-level elements and mixed content.
"""

from __future__ import annotations

import re

import xml.etree.ElementTree as ET

from pyxml_compiler.nodes import CommentNode, PyxmlNode, TextNode


def parse_pyxml(content: str) -> PyxmlNode:
    """Parse a PyXML source string into a PyxmlNode AST.

    The input is XML-like markup. Multiple top-level elements are allowed.
    XML comments are preserved as CommentNode objects.

    Args:
        content: The PyXML source string.

    Returns:
        A root PyxmlNode wrapping the parsed content. If the source
        contains a single top-level element, that element is returned
        directly instead of the wrapper.

    Raises:
        PyxmlParseError: If the content cannot be parsed as valid XML.
    """
    # Strip comments and store them with position markers
    comments: list[tuple[str, str]] = []
    comment_counter: int = 0

    def replace_comment(match: re.Match[str]) -> str:
        """Replace an XML comment with a placeholder element."""
        nonlocal comment_counter
        comment_text: str = match.group(1).strip()
        placeholder: str = f'<_pyxml_comment_ id="{comment_counter}" />'
        comments.append((str(comment_counter), comment_text))
        comment_counter += 1
        return placeholder

    processed: str = re.sub(r"<!--(.*?)-->", replace_comment, content, flags=re.DOTALL)

    # Wrap in a root element to allow multiple top-level elements
    wrapped: str = f"<_pyxml_root_>{processed}</_pyxml_root_>"

    try:
        root_element: ET.Element = ET.fromstring(wrapped)
    except ET.ParseError as e:
        raise PyxmlParseError(f"Failed to parse PyXML: {e}") from e

    # Convert ElementTree to our AST
    root_node: PyxmlNode = _element_to_node(root_element, comments)

    # If the root wrapper has a single child element, return it directly
    if len(root_node.children) == 1 and isinstance(root_node.children[0], PyxmlNode):
        return root_node.children[0]

    return root_node


def _element_to_node(
    element: ET.Element,
    comments: list[tuple[str, str]],
) -> PyxmlNode:
    """Recursively convert an ElementTree element to a PyxmlNode.

    Args:
        element: The ElementTree element to convert.
        comments: List of (id, text) tuples for comment placeholders.

    Returns:
        The PyxmlNode representation of the element.
    """
    # Check if this is a comment placeholder
    if element.tag == "_pyxml_comment_":
        comment_id: str = element.get("id", "")
        comment_text: str = ""
        for cid, ctext in comments:
            if cid == comment_id:
                comment_text = ctext
                break
        # Return a PyxmlNode wrapping a CommentNode — we'll handle this
        # specially. Actually, return a node that will be recognized.
        node: PyxmlNode = PyxmlNode(tag="_comment_", attributes={"text": comment_text})
        return node

    # Build attributes dict (excluding internal ones)
    attributes: dict[str, str] = dict(element.attrib)

    # Create the node
    node = PyxmlNode(tag=element.tag, attributes=attributes)

    # Handle text content (text before first child)
    if element.text and element.text.strip():
        node.children.append(TextNode(text=element.text))
    elif element.text and not element.text.strip() and element.text:
        # Preserve whitespace-only text if there are no children
        # (leaf text nodes)
        if len(element) == 0:
            if element.text.strip() == "":
                pass  # skip pure whitespace in empty elements
            else:
                node.children.append(TextNode(text=element.text))

    # Handle child elements
    for child_element in element:
        child_node: PyxmlNode = _element_to_node(child_element, comments)
        if child_node.tag == "_comment_":
            node.children.append(
                CommentNode(text=child_node.attributes.get("text", ""))
            )
        else:
            node.children.append(child_node)

        # Handle tail text (text after this child, before next sibling)
        if child_element.tail and child_element.tail.strip():
            node.children.append(TextNode(text=child_element.tail))

    # For leaf elements with text content
    if len(element) == 0 and element.text and element.text.strip():
        # Already handled above, but ensure no duplication
        # Only add if not already added
        has_text: bool = any(isinstance(c, TextNode) for c in node.children)
        if not has_text:
            node.children.append(TextNode(text=element.text))

    return node


class PyxmlParseError(Exception):
    """Raised when PyXML source cannot be parsed."""
