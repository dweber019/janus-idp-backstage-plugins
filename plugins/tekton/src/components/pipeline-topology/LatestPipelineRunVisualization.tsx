import React from 'react';
import { TektonResourcesContext } from '../../hooks/TektonResourcesContext';
import { useTektonObjectsResponse } from '../../hooks/useTektonObjectsResponse';
import { ModelsPlural } from '../../models';
import { PipelineVisualization } from './PipelineVisualization';

type LatestPipelineRunVisualizationProps = {
  linkTekton?: boolean;
  url?: string;
};

export const LatestPipelineRunVisualization = ({
  linkTekton,
  url,
}: LatestPipelineRunVisualizationProps) => {
  const watchedResources = [ModelsPlural.pipelineruns, ModelsPlural.taskruns];
  const tektonResourcesContextData = useTektonObjectsResponse(watchedResources);

  return (
    <TektonResourcesContext.Provider value={tektonResourcesContextData}>
      <PipelineVisualization linkTekton={linkTekton} url={url} />
    </TektonResourcesContext.Provider>
  );
};
