import React from 'react';
import { Projects } from '../../../models';

export type RecentProjectsCommons = {
  hasProjects: boolean;
  projectList: Array<Projects.ProjectData>;
};

export type RecentProjectsProps = Partial<RecentProjectsCommons> &
  React.AllHTMLAttributes<HTMLDivElement>;

export const RecentProjects = (props: RecentProjectsProps) => {
  const hasProjects = props.hasProjects || false;
  const projectList = props.projectList || [];

  const handleOpenProject = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    const projectBtn = ev.currentTarget;

    if (!projectBtn.dataset.projectId) {
      console.error(`Unable to open project: project id required`);
      return;
    }

    const projectId = parseInt(projectBtn.dataset.projectId);

    if (isNaN(projectId)) {
      console.error(
        `Unable to open project: malformed id - ${projectBtn.dataset.projectId}`
      );
      return;
    }

    Projects.open(projectId);
  };

  return (
    <div>
      {!hasProjects ? (
        <></>
      ) : (
        <>
          <h2 className="section-title">Recent</h2>
          <ul>
            {projectList.map((project: Projects.ProjectData, index: number) => (
              <button
                className="section-link"
                key={index}
                onClick={handleOpenProject}
                data-project-id={project.id}
              >
                {project.name}
              </button>
            ))}
            <div style={{ marginTop: '2rem' }}>
              <button className="section-link">More...</button>
            </div>
          </ul>
        </>
      )}
    </div>
  );
};

export default {
  RecentProjects,
};