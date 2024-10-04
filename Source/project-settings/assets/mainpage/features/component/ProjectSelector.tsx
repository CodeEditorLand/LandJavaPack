// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { Dispatch } from "@reduxjs/toolkit";
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProjectInfo } from "../../../../types";
import { activeProjectChange } from "../../../mainpage/features/commonSlice";
import {
	ClasspathRequest,
	CompilerRequest,
	MavenRequest,
} from "../../../vscode/utils";

const ProjectSelector = (): JSX.Element | null => {
	const activeProjectIndex: number = useSelector(
		(state: any) => state.commonConfig.ui.activeProjectIndex,
	);
	const projects: ProjectInfo[] = useSelector(
		(state: any) => state.commonConfig.data.projects,
	);

	const dispatch: Dispatch<any> = useDispatch();

	const handleActiveProjectChange = (index: number) => {
		dispatch(activeProjectChange(index));
	};

	useEffect(() => {
		if (projects.length === 0) {
			return;
		}

		ClasspathRequest.onWillLoadProjectClasspath(
			projects[activeProjectIndex].rootPath,
		);
		CompilerRequest.onWillGetCompilerSettings(
			projects[activeProjectIndex].rootPath,
		);
		MavenRequest.onWillGetSelectedProfiles(
			projects[activeProjectIndex].rootPath,
		);
	}, [activeProjectIndex, projects]);

	const projectSelections = projects.map((project, index) => {
		if (projects.length === 0) {
			return null;
		}

		return (
			<VSCodeOption
				className="setting-section-option"
				key={project.rootPath}
				onClick={() => handleActiveProjectChange(index)}>
				{project.name}
			</VSCodeOption>
		);
	});

	return (
		<div id="project-selector" className="setting-section">
			<div className="flex-center mb-2 mt-2">
				<span className="setting-section-description ml-1 mr-1">
					Project:
				</span>
				<VSCodeDropdown className="setting-section-dropdown">
					{projectSelections}
				</VSCodeDropdown>
			</div>
		</div>
	);
};

export default ProjectSelector;
