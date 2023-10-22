import { useContext, useEffect, useState } from "react";
import * as Api from "../../../utils/api";
import { Form, Card, Col } from "react-bootstrap";
import FormWrapper from "../../../common/FormWrapper";
import ButtonCommon from "../../../common/ButtonCommon";
import { UserStateContext } from "../../../../App";

const Education = ({
  setAddForm,
  isEditable,
  optionArr,
  education = [],
  setEducations,
}) => {
  // useState 훅을 통해 user 상태를 생성함.
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [schoolName, setSchoolName] = useState(education.schoolName || "");
  const [major, setMajor] = useState(education.major || "");
  const [degree, setDegree] = useState(education.degree || "");
  const [admissionDate, setAdmissionDate] = useState(
    education.admissionDate || "2023-01-01"
  );
  const [graduationDate, setGraduationDate] = useState(
    education.graduationDate || "2023-01-01"
  );
  const userState = useContext(UserStateContext);

  //form 상세설정 어레이
  const formList = [
    {
      controlId: "eduSchoolName",
      customClassName: "mb-3",
      label: "학교이름",
      placeholder: "학교이름",
      value: schoolName,
      changeHandler: (v) => setSchoolName(v),
    },
    {
      controlId: "eduMajor",
      customClassName: "mb-3",
      label: "전공",
      placeholder: "전공",
      value: major,
      changeHandler: (v) => setMajor(v),
    },
    {
      controlId: "eduDegree",
      select: "true",
      customClassName: "mb-3",
      label: "학위",
      placeholder: "학위",
      value: degree,
      changeHandler: (v) => setDegree(v),
      optionValue: "학위를 선택하세요",
      optionArr: optionArr,
    },
    {
      controlId: "startDate",
      customClassName: "mb-3",
      value: admissionDate,
      changeHandler: (v) => setAdmissionDate(v),
      label: "입학연월일",
      type: "date",
    },
    {
      controlId: "endDate",
      customClassName: "mb-3",
      value: graduationDate,
      changeHandler: (v) => setGraduationDate(v),
      label: "졸업연월일",
      type: "date",
    },
  ];

  //수정해서 onSubmitHandler
  const onSubmitHandler = async (e) => {
    //제출버튼 클릭시
    e.preventDefault();
    console.log("handler clicked");

    console.log({ schoolName, major, degree, admissionDate, graduationDate });

    //portfolioOwnerId는 portfolio에서 받아옴

    //post 서버와 통신
    const res = await Api.post(
      `user/${userState.user.id}/education`,
      {
        schoolName,
        major,
        degree,
        admissionDate,
        graduationDate,
      },
      "Education"
    );
    console.log(res.ok);
    if (res.data.ok) {
      setEducations((prev) => {
        return [
          ...prev,
          { schoolName, major, degree, admissionDate, graduationDate },
        ];
      });
      setSchoolName("");
      setMajor("");
      setDegree("");
      setAdmissionDate("2023-01-01");
      setGraduationDate("2023-01-01");
      setAddForm(false);
    } else if (!res.data.ok) {
      throw new Error("POST 요청을 실패하였습니다.");
    }
  };

  //삭제함수

  const onClickDel = async (eduId) => {
    console.log("delete버튼이 선택됨");
    console.log(eduId);

    const res = await Api.delete(
      `user/${userState.user.id}/education`,
      eduId,
      "Education"
    );
    console.log(res);
    // if (res.data.ok) {
    setEducations((prev) =>
      prev.filter((educations) => Number(educations.eduId) !== Number(eduId))
    );
    // } else if (!res.data.ok) {
    // throw new Error("삭제를 실패하였습니다");
    // }
  };

  return (
    <Card>
      <Card.Body>
        {!editMode && (
          <>
            <Card style={{ width: "100%" }}>
              <Card.Body>
                <Card.Title>{education.schoolName}</Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                  {education.major}
                  <br />
                  {education.degree}
                </Card.Subtitle>
                <Card.Text>
                  {education.admissionDate} ~ {education.graduationDate}
                </Card.Text>

                {isEditable && (
                  <Form.Group className="mt-3 text-center">
                    <Col sm={{ span: 20 }}>
                      <ButtonCommon
                        variant="primary"
                        type="submit"
                        className="me-3"
                        text="수정"
                        onClickHandler={() => setEditMode((prev) => !prev)}
                      />

                      <ButtonCommon
                        variant="secondary"
                        text="삭제"
                        onClickHandler={() => onClickDel(education.eduId)}
                      />
                    </Col>
                  </Form.Group>
                )}
              </Card.Body>
            </Card>
          </>
        )}
        {editMode && (
          <FormWrapper
            formList={formList}
            onSubmitHandler={onSubmitHandler}
            setAddForm={setEditMode}
            isEditable={isEditable}
            onClickHandler={setAddForm}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default Education;
