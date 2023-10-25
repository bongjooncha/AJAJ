import React, { useContext, useState } from "react";
import { Button, Form, Card, Col, Row } from "react-bootstrap";
import * as Api from "../../../utils/api";
import { PortfolioOwnerDataContext } from "../Portfolio";

function UserEditForm({ user, setIsEditing, setUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [description, setDescription] = useState(user.description);
  const portfolioOwnerData = useContext(PortfolioOwnerDataContext);

  //제출버튼 클릭시 patch메서드 실행
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await Api.patch(`users/${portfolioOwnerData.id}`, {
        name,
        email,
        description,
      });

      if (res.status === 200) {
        setUser((prev) => {
          return {
            ...prev,
            name,
            email,
            description,
          };
        });
        setName("");
        setEmail("");
        setDescription("");
        setIsEditing(false);
      } else if (res.status !== 200) {
        throw new Error("PATCH 요청이 실패하였습니다.");
      }
    } catch (err) {
      throw new Error("서버와 통신이 실패하였습니다.");
    }
  };

  // setUser(updatedUser);
  // setIsEditing(false);

  return (
    <Card className="mb-2">
      <Card.Body>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group controlId="useEditName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="userEditEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="userEditDescription">
            <Form.Control
              type="text"
              placeholder="정보, 인사말"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 20 }}>
              <Button variant="primary" type="submit" className="me-3">
                확인
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UserEditForm;
