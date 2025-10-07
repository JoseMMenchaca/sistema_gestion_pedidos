-- Script de creacion de datos de Prueba para db_fastexpress
-- ----------------------------------------------------------
-- Para las tablas: categorias, clientes, productos, usuarios
-- ----------------------------------------------------------
--
-- 1. Inserción de datos en la tabla 'categorias'
--
INSERT INTO categorias (id, nombre, descripcion) VALUES
(1, 'Pollos', 'Platos con base de Pollo'),
(2, 'Hamburguesas', 'Hamburguesas'),
(3, 'Combos', 'Combos disponibles'),
(4, 'Refrescos', 'Refrescos y gaseosas');

---

--
-- 2. Inserción de datos en la tabla 'clientes'
--
-- NOTA: Se utiliza NOW() para las columnas createdAt y updatedAt.
INSERT INTO clientes (id, nombre, direccion, celular, email, estado, createdAt, updatedAt) VALUES
(1, 'Ana Antelo', 'Boliviar 123', '76543210', 'ana@mail.com', 1, NOW(), NOW()),
(2, 'Beatriz Bueno', 'Sucre 234', '76420876', 'beatriz@mail.com', 1, NOW(), NOW()),
(3, 'Camen Castro', 'Ayacucho 345', '75432109', 'carmen@mail.com', 1, NOW(), NOW()),
(4, 'Daniel Davalos', 'Junin 456', '74321098', 'daniel@mail.com', 1, NOW(), NOW()),
(5, 'Esteban Estrada', 'Cochabamba 567', '73210987', 'esteban@mail.com', 1, NOW(), NOW()),
(6, 'Fernando Fernandez', 'La Paz 678', '72109876', 'fernando@mail.com', 1, NOW(), NOW()),
(7, 'Gladys Gutierrez', 'Oruro 789', '71098765', 'gradys@mail.com', 1, NOW(), NOW()),
(8, 'Hector Huanca', 'Potosi 890', '70987654', 'hector@mail.com', 1, NOW(), NOW());

---

--
-- 3. Inserción de datos en la tabla 'usuarios'
--
INSERT INTO usuarios (id, username, email, contrasena, estado) VALUES
(1, 'admin', 'admin@mail.com', '123', 1);

---

--
-- 4. Inserción de datos en la tabla 'productos'
--
-- NOTA: Se utiliza NOW() para las columnas createdAt y updatedAt.
INSERT INTO productos (id, nombre, descripcion, precio, stock, estado, imagen, createdAt, updatedAt, categoria_id) VALUES
(1, 'Combo Bocadito', 'Una presa de pollo, Porcion de papa, Gaseosa de 300 ml', 18.0, 0, 1, '/uploads/COMBO-BOCADITO.jpg', NOW(), NOW(), 3),
(2, 'Combo Coppa', '4 presas de pollo, 2 porciones de papa, 2 porciones de arroz, 2 gaseosas de 300 ml', 55.0, 0, 1, '/uploads/COMBO-COPPA.jpg', NOW(), NOW(), 3),
(3, 'Combo Duo', '2 presas de pollo, 1 papa, 1 gaseosa de 300 ml', 25.0, 0, 1, '/uploads/COMBO-DUO.jpg', NOW(), NOW(), 3),
(4, 'Combo Trio', '3 presas de pollo, 1 papa, 1 gaseosas 300 ml.', 32.0, 0, 1, '/uploads/COMBO-TRIO.jpg', NOW(), NOW(), 3),
(5, 'Pollo Duo', '2 presas de pollo', 32.0, 0, 1, '/uploads/DUO-POLLO.png', NOW(), NOW(), 1),
(6, 'Hamburguesa doble', '2 carnes, tocino, queso, 1 papa, 1 gaseosa', 32.0, 0, 1, '/uploads/HAMBURGUESA-DOBLE.png', NOW(), NOW(), 2),
(7, 'Hamburguesa simple', '1 carne, tomate, 1 papa, 1 gaseosa 300 ml.', 25.0, 0, 1, '/uploads/HAMBURGUESA-SIMPLE.png', NOW(), NOW(), 2),
(8, 'Pipocas de Pollo', 'Pipocas de Pollo con papas', 18.0, 0, 1, '/uploads/PIPOCAS.jpg', NOW(), NOW(), 1),
(9, 'Solo Pollo', '1 porcion de pollo', 22.0, 0, 1, '/uploads/PORCION-POLLO.png', NOW(), NOW(), 1),
(10, 'Trio de pollo', '3 presas de pollo', 33.0, 0, 1, '/uploads/TRIO-POLLO.png', NOW(), NOW(), 1);