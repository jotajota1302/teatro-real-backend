import unittest
from BinarySearchTree import BinarySearchTree, TreeNode

class TestBinarySearchTree(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Creación y configuración del árbol con los valores de muestra
        cls.bst = BinarySearchTree()
        sample_values = [10, 5, 15, 3, 7, 13, 17]
        for val in sample_values:
            cls.bst.insert(val)

    def test_tree_structure(self):
        # Verificamos la estructura del árbol creada en setUpClass
        root = self.bst.root
        self.assertIsNotNone(root)
        self.assertEqual(root.value, 10, "La raíz debe ser 10")
        self.assertEqual(root.left.value, 5, "El hijo izquierdo de la raíz debe ser 5")
        self.assertEqual(root.right.value, 15, "El hijo derecho de la raíz debe ser 15")
        self.assertEqual(root.left.left.value, 3, "El hijo izquierdo de 5 debe ser 3")
        self.assertEqual(root.left.right.value, 7, "El hijo derecho de 5 debe ser 7")
        self.assertEqual(root.right.left.value, 13, "El hijo izquierdo de 15 debe ser 13")
        self.assertEqual(root.right.right.value, 17, "El hijo derecho de 15 debe ser 17")

    def test_find_existing_value(self):
        # Probamos que la función find devuelve True para los valores existentes
        existing_values = [10, 5, 15, 3, 7, 13, 17]
        for val in existing_values:
            self.assertTrue(self.bst.find(val), f"find({val}) debería devolver True")

    def test_find_non_existent_value(self):
        # Probamos que la función find devuelve False para los valores no existentes
        non_existent_values = [0, 6, 8, 11, 20]
        for val in non_existent_values:
            self.assertFalse(self.bst.find(val), f"find({val}) debería devolver False")

    def test_higher_value_returns_correct_result(self):
        # Verificamos que higher(val) devuelve el número menor del árbol que es mayor que val
        test_cases = [
            (3, 5),
            (5, 7),
            (7, 10),
            (10, 13),
            (13, 15),
            (15, 17)
        ]
        for val, expected in test_cases:
            result = self.bst.higher(val)
            self.assertEqual(result, expected, f"higher({val}) debería devolver {expected}")

    def test_higher_value_error_for_lowest_value(self):
        # Verificamos que se genera ValueError para el valor más alto
        highest_value = 17
        with self.assertRaises(ValueError, msg=f"higher({highest_value}) debería generar un ValueError porque es el valor más alto del árbol"):
            self.bst.higher(highest_value)

    def test_higher_value_error_for_non_existent_value(self):
        # Verificamos que se genera ValueError para valores que no están en el árbol
        non_existent_values = [0, 6, 8, 11, 20]
        for val in non_existent_values:
            with self.assertRaises(ValueError, msg=f"higher({val}) debería generar un ValueError porque el valor no existe en el árbol"):
                self.bst.higher(val)

    def test_lower_value_returns_correct_result(self):
        # Verificamos que lower(val) devuelve el mayor número en el árbol que es menor que val
        test_cases = [
            (4, 3),
            (6, 5),
            (10, 7),
            (14, 13),
            (18, 17)
        ]
        for val, expected in test_cases:
            result = self.bst.lower(val)
            self.assertEqual(result, expected, f"lower({val}) debería devolver {expected}")

    def test_lower_value_error_for_lowest_value(self):
        # Verificamos que se genera ValueError para el valor más bajo en el árbol
        lowest_value = 3
        with self.assertRaises(ValueError, msg=f"lower({lowest_value}) debería generar un ValueError porque es el valor más bajo del árbol"):
            self.bst.lower(lowest_value)

    def test_lower_value_error_for_non_existent_value(self):
        # Verificamos que se genera ValueError para valores que no están en el árbol
        non_existent_values = [0, 6, 8, 11, 20]
        for val in non_existent_values:
            with self.assertRaises(ValueError, msg=f"lower({val}) debería generar un ValueError porque el valor no existe en el árbol"):
                self.bst.lower(val)

if __name__ == '__main__':
    unittest.main()