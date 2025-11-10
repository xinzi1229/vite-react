import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, Table, Button, Form, Modal } from 'react-bootstrap';

// 定义 User 类型
interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
}

function App() {
  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for CRUD operations
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    phone: '',
    role: ''
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal for adding or editing a user
  const openModal = (user?: User) => {
    if (user) {
      setIsEditing(true);
      setCurrentUser(user);
      setFormData({
        name: user.name,
        phone: user.phone,
        role: user.role
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: '',
        phone: '',
        role: ''
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setFormData({
      name: '',
      phone: '',
      role: ''
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentUser) {
      // Update existing user
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === currentUser.id 
            ? { ...user, ...formData } 
            : user
        )
      );
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...formData
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
    }
    
    closeModal();
  };

  // Delete a user
  const deleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">User Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Settings</Nav.Link>
              <Nav.Link href="#">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content with Sidebar */}
      <Container fluid className="flex-grow-1 d-flex flex-column p-0">
        <Row className="flex-grow-1 g-0">
          {/* Sidebar */}
          <Col md={3} lg={2} className="bg-light p-3">
            <Nav className="flex-column">
              <Nav.Link href="#" active>Dashboard</Nav.Link>
              <Nav.Link href="#">Users</Nav.Link>
              <Nav.Link href="#">Reports</Nav.Link>
              <Nav.Link href="#">Analytics</Nav.Link>
              <Nav.Link href="#">Messages</Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>User Management</h2>
              <Button variant="primary" onClick={() => openModal()}>
                Add New User
              </Button>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                Error: {error}
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => openModal(user)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>

      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formphone">
              <Form.Label>phone</Form.Label>
              <Form.Control
                type="phone"
                placeholder="Enter phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default App;