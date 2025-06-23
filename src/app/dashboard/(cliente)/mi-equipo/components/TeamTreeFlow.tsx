"use client";

import {
    Background,
    BackgroundVariant,
    ConnectionLineType,
    Controls,
    Edge,
    MarkerType,
    Node,
    Panel,
    ReactFlow,
    useEdgesState,
    useNodesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { TeamMember } from "../actions/teamTree";
import { calculateHorizontalSpacing } from "../utils/size";
import { TeamMemberNode } from "./TeamMemberNode";

interface TeamTreeFlowProps {
    tree: TeamMember;
    currentUserId: string;
    viewingUserId: string;
    onSelectMember: (member: TeamMember) => void;
    onNavigateToUser: (userId: string) => void;
    currentDepth?: number;
}

const nodeTypes = {
    teamMember: TeamMemberNode,
};

export function TeamTreeFlow({
    tree,
    currentUserId,
    viewingUserId,
    onSelectMember,
    onNavigateToUser,
    currentDepth
}: TeamTreeFlowProps) {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);


    const transformTreeToFlow = useCallback(
        (
            node: TeamMember,
            parentId: string | null = null,
            position = { x: 0, y: 0 },
            level = 0
        ): { nodes: Node[]; edges: Edge[] } => {
            const flowNodes: Node[] = [];
            const flowEdges: Edge[] = [];

            // Verificar si tiene hijos para determinar sourceHandle
            const hasChildren = !!(node.children?.left || node.children?.right);

            // Crear nodo actual
            const flowNode: Node = {
                id: node.id,
                type: "teamMember",
                position,
                data: {
                    member: node,
                    isCurrentUser: node.id === currentUserId,
                    isViewingUser: node.id === viewingUserId,
                    hasChildren: hasChildren,
                    onSelect: () => onSelectMember(node),
                    onNavigate: () => onNavigateToUser(node.id),
                },
                draggable: false,
            };

            flowNodes.push(flowNode);

            // Crear edge desde el padre si existe
            if (parentId) {
                const edge: Edge = {
                    id: `${parentId}-${node.id}`,
                    source: parentId,
                    target: node.id,
                    // sourceHandle: 'bottom',
                    // targetHandle: 'top',
                    type: ConnectionLineType.SmoothStep,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 10,
                        height: 10,
                    },
                    style: { strokeWidth: 2.5 },
                    animated: node.id === viewingUserId,
                    label: tree.position === "LEFT" ? "IZQ" : "DER",

                    // labelBgPadding: [4, 8],
                    // labelBgBorderRadius: 4,
                    // labelBgStyle: {
                    //     fill: "hsl(var(--background))",
                    //     fillOpacity: 0.9,
                    // },
                };

                flowEdges.push(edge);
            }

            // Procesar hijos
            const horizontalSpacing = calculateHorizontalSpacing(level, currentDepth || 2);
            const verticalSpacing = 220;

            if (node.children?.left) {
                const leftPosition = {
                    x: position.x - horizontalSpacing,
                    y: position.y + verticalSpacing,
                };

                const leftResult = transformTreeToFlow(
                    node.children.left,
                    node.id,
                    leftPosition,
                    level + 1
                );

                flowNodes.push(...leftResult.nodes);
                flowEdges.push(...leftResult.edges);
            }

            if (node.children?.right) {
                const rightPosition = {
                    x: position.x + horizontalSpacing,
                    y: position.y + verticalSpacing,
                };

                const rightResult = transformTreeToFlow(
                    node.children.right,
                    node.id,
                    rightPosition,
                    level + 1
                );

                flowNodes.push(...rightResult.nodes);
                flowEdges.push(...rightResult.edges);
            }

            return { nodes: flowNodes, edges: flowEdges };
        },
        [currentUserId, viewingUserId, onSelectMember, onNavigateToUser]
    );

    // Actualizar nodos y edges cuando cambie el árbol
    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = transformTreeToFlow(tree);
        setNodes(newNodes);
        setEdges(newEdges);
    }, [tree, transformTreeToFlow, setNodes, setEdges]);

    return (
        <div className="w-full h-[700px] border rounded-lg bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                    padding: 0.2,
                    minZoom: 0.1,
                    maxZoom: 1.5,
                }}
                minZoom={0.1}
                maxZoom={2}
                attributionPosition="bottom-left"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                colorMode={isDarkMode ? "dark" : "light"}
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                    type: ConnectionLineType.SmoothStep,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 8,
                        height: 8,
                    },
                    style: {
                        strokeWidth: 2.5,
                    },
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={16}
                    size={1}
                    color={isDarkMode ? "#374151" : "#e5e7eb"}
                />

                <Controls
                    position="bottom-right"
                    showInteractive={false}
                    style={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                    }}
                />

                <Panel
                    position="top-left"
                    className="bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-md border m-2"
                >
                    <div className="text-xs space-y-1">
                        <p className="font-medium">Vista del Equipo</p>
                        <p className="text-muted-foreground">
                            Usuario: {tree.fullName || tree.email.split("@")[0]}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-muted-foreground">Usuario actual</span>
                        </div>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}