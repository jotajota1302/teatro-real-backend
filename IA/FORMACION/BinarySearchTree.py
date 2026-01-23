class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert_recursive(self.root, val)

    def _insert_recursive(self, node, val):
        if node is None:
            return TreeNode(val)

        if val < node.value:
            node.left = self._insert_recursive(node.left, val)
        else:
            node.right = self._insert_recursive(node.right, val)

        return node

    def find(self, val):
        return self._find_recursive(self.root, val)

    def _find_recursive(self, node, val):
        if node is None:
            return False

        if val == node.value:
            return True
        elif val < node.value:
            return self._find_recursive(node.left, val)
        else:
            return self._find_recursive(node.right, val)

    def higher(self, val):
        if not self.find(val):
            raise ValueError("Value not found in the tree")

        if not self.root:
            raise ValueError("Tree is empty")

        higher_val = self._find_higher_recursive(self.root, val)
        if higher_val is None:
            raise ValueError("No higher value found")

        return higher_val

    def _find_higher_recursive(self, node, val):
        if node is None:
            return None

        if node.value <= val:
            return self._find_higher_recursive(node.right, val)
        else:
            left_higher = self._find_higher_recursive(node.left, val)
            return node.value if left_higher is None else left_higher


    def lower(self, val):
        if not self.find(val):
            raise ValueError("Value not found in the tree")
        
        if not self.root:
            raise ValueError("Tree is empty")

        lower_val = self._find_lower_recursive(self.root, val)
        if lower_val is None:
            raise ValueError("No lower value found")

        return lower_val

    def _find_lower_recursive(self, node, val):
        if node is None:
            return None

        if node.value >= val:
            return self._find_lower_recursive(node.left, val)
        else:
            right_lower = self._find_lower_recursive(node.right, val)
            return node.value if right_lower is None else right_lower


    def _find_node_recursive(self, node, val):
        if node is None:
            return None

        if val == node.value:
            return node
        elif val < node.value:
            return self._find_node_recursive(node.left, val)
        else:
            return self._find_node_recursive(node.right, val)



