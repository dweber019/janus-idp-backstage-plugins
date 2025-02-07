import { InfoCard, Progress } from '@backstage/core-components';
import {
  BaseNode,
  SELECTION_EVENT,
  SelectionEventListener,
  TopologyView,
  VisualizationSurface,
  useEventListener,
  useVisualizationController,
} from '@patternfly/react-topology';
import React from 'react';
import { TYPE_WORKLOAD } from '../../const';
import { K8sResourcesContext } from '../../hooks/K8sResourcesContext';
import { useSideBar } from '../../hooks/useSideBar';
import { useWorkloadsWatcher } from '../../hooks/useWorkloadWatcher';
import { ClusterErrors } from '../../types/types';
import { TopologyControlBar } from './TopologyControlBar';
import { TopologyEmptyState } from './TopologyEmptyState';
import TopologyErrorPanel from './TopologyErrorPanel';
import TopologyToolbar from './TopologyToolbar';

import './TopologyToolbar.css';

type TopologyViewWorkloadComponentProps = {
  useToolbar?: boolean;
};

const TopologyViewWorkloadComponent = ({
  useToolbar = false,
}: TopologyViewWorkloadComponentProps) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const controller = useVisualizationController();
  const layout = 'ColaNoForce';
  const { loaded, dataModel } = useWorkloadsWatcher();
  const { clusters, selectedClusterErrors, responseError } =
    React.useContext(K8sResourcesContext);
  const [sideBar, sideBarOpen, selectedId, setSideBarOpen, setSelectedNode] =
    useSideBar(selectedIds);

  const allErrors: ClusterErrors = [
    ...(responseError ? [{ message: responseError }] : []),
    ...(selectedClusterErrors ?? []),
  ];

  React.useEffect(() => {
    if (loaded && dataModel) {
      const model = {
        graph: {
          id: 'g1',
          type: 'graph',
          layout,
        },
        ...dataModel,
      };
      controller.fromModel(model, false);
    }
  }, [layout, loaded, dataModel, controller]);

  React.useEffect(() => {
    if (dataModel) {
      const selectedNode: BaseNode | null = selectedId
        ? (controller.getElementById(selectedId) as BaseNode)
        : null;
      setSelectedNode(selectedNode);
      if (selectedNode && selectedNode.getType() === TYPE_WORKLOAD)
        setSideBarOpen(true);
      else {
        setSideBarOpen(false);
      }
    }
  }, [controller, dataModel, selectedId, setSelectedNode, setSideBarOpen]);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, ids => {
    setSelectedIds(ids);
  });

  if (!loaded)
    return (
      <div data-testid="topology-progress">
        <Progress />
      </div>
    );

  return (
    <>
      {allErrors && allErrors.length > 0 && (
        <TopologyErrorPanel allErrors={allErrors} />
      )}
      <InfoCard className="bs-topology-wrapper" divider={false}>
        {clusters.length < 1 ? (
          <TopologyEmptyState />
        ) : (
          <TopologyView
            controlBar={
              loaded &&
              dataModel?.nodes?.length > 0 && (
                <TopologyControlBar controller={controller} />
              )
            }
            viewToolbar={useToolbar && <TopologyToolbar />}
            sideBar={sideBar}
            sideBarResizable
            sideBarOpen={sideBarOpen}
            minSideBarSize="400px"
          >
            {loaded && dataModel?.nodes?.length === 0 ? (
              <TopologyEmptyState />
            ) : (
              <VisualizationSurface state={{ selectedIds }} />
            )}
          </TopologyView>
        )}
      </InfoCard>
    </>
  );
};

export default TopologyViewWorkloadComponent;
