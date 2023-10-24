import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { UserStateContext } from "../../../../App";
import * as Api from "../../../utils/api";
import ButtonCommon from "../../../common/ButtonCommon";
import FormWrapper from "../../../common/FormWrapper";
import { PortfolioOwnerDataContext } from "../Portfolio";
import { projectsCommonFormProps } from "../../../utils/formListCommonProps";
import Project from "./Project";

//********************************서버와 통신전 **************************************

const projects = [
  {
    id: "1",
    projectName: "프로젝트 제목",
    projectDetail: "프로젝트 설명입니다 하하하",
    projectImgUrl: "https://picsum.photos/200/200",
    projectStartDate: "2111-06-01",
    projectEndDate: "2023-01-01",
  },
  {
    id: "2",
    projectName: "프로젝트 제목22",
    projectDetail: "프로젝트 설명222입니다 하하하",
    projectImgUrl: "https://picsum.photos/200/200",
    projectStartDate: "2023-01-01",
    projectEndDate: "2023-01-01",
  },
];
const Projects = (props) => {
  const [addForm, setAddForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDetail, setProjectDetail] = useState("");
  const [projectImgUrl, setProjectImgUrl] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("2023-01-01");
  const [projectEndDate, setProjectEndDate] = useState("2023-01-01");
  const userState = useContext(UserStateContext);
  const portfolioOwnerData = useContext(PortfolioOwnerDataContext);
  const { isEditable } = props;

  //form 상세설정 어레이
  const projectState = [
    { value: projectName, changeHandler: (v) => setProjectName(v) },
    { value: projectDetail, changeHandler: (v) => setProjectDetail(v) },
    {
      value: projectImgUrl,
      changeHandler: (v) => setProjectImgUrl(v),
    },
    { value: projectStartDate, changeHandler: (v) => setProjectStartDate(v) },
    { value: projectEndDate, changeHandler: (v) => setProjectEndDate(v) },
  ];

  const projectFormList = projectsCommonFormProps.map(
    (projectCommon, index) => {
      return { ...projectCommon, ...projectState[index] };
    }
  );

  //제출버튼 클릭시
  const handleSubmit = async (e) => {
    e.preventDefault();

    //portfolioOwnerId는 portfolio에서 받아옴

    //post 서버와 통신
    try {
      const res = await Api.post(`user/${userState.user.id}/project`, {
        projectName,
        projectDetail,
        projectImgUrl,
        projectStartDate,
        projectEndDate,
      });

      const postedNewId = res.data.projectId;
      console.log(res);

      if (res.status === 201) {
        setProjects((prev) => {
          return [
            ...prev,
            {
              projectId: postedNewId,
              projectName,
              projectDetail,
              projectImgUrl,
              projectStartDate,
              projectEndDate,
            },
          ];
        });
        setProjectName("");
        setProjectDetail("");
        setProjectImgUrl("");
        setProjectStartDate("2023-01-01");
        setProjectEndDate("2023-01-01");
        setAddForm(false);
      } else if (res.status !== 201) {
        throw new Error("POST 요청이 실패하였습니다.");
      }
    } catch (err) {
      throw new Error("서버와 통신이 실패하였습니다.");
    }
  };

  // 모든 프로젝트 목록 가져오기 서버와 통신
  useEffect(() => {
    Api.get(`user/${portfolioOwnerData.id}/projects`, "", "projects").then(
      (res) => {
        console.log(res.data.projects);
        return setProjects(res.data.projects);
      }
    );
  }, [portfolioOwnerData.id]);

  return (
    <>
      <Card>
        <h4>프로젝트</h4>
        {projects.map((project, index) => (
          <Project
            key={`project-${index}`}
            isEditable={isEditable}
            formList={projectFormList}
            setProjects={setProjects}
            project={project}
          />
        ))}
        {isEditable && (
          <Card>
            {addForm && (
              <FormWrapper
                {...props}
                formList={projectFormList}
                onSubmitHandler={handleSubmit}
                setAddForm={setAddForm}
              />
            )}
            <ButtonCommon
              variant="outline-info"
              size="sm"
              onClickHandler={() => setAddForm((prev) => !prev)}
              text="+"
            />
          </Card>
        )}
      </Card>
    </>
  );
};

export default Projects;
