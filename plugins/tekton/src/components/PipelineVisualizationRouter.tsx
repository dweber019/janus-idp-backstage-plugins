import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { TEKTON_CI_ANNOTATION } from '../consts/tekton-const';
import { LatestPipelineRunVisualization } from './pipeline-topology';

/** @public */
export const isTektonCIAvailable = (entity: Entity): boolean =>
  entity.metadata.annotations?.[TEKTON_CI_ANNOTATION] === 'true';

type PipelineVisualizationRouterProps = {
  linkTekton?: boolean;
  url?: string;
};

/** @public */
export const PipelineVisualizationRouter = ({
  linkTekton,
  url,
}: PipelineVisualizationRouterProps) => {
  const { entity } = useEntity();
  if (isTektonCIAvailable(entity)) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <LatestPipelineRunVisualization linkTekton={linkTekton} url={url} />
          }
        />
      </Routes>
    );
  }
  return null;
};
