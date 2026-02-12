import React from 'react';
import { Box, Sphere, Capsule, Cylinder, Cone, Torus, Plane } from '@react-three/drei';
import type { ActorRendererProps } from '../registry/ActorRegistry';
import { MaterialComponent } from '../MaterialComponent';

const PrimitiveShape: React.FC<{ component: any } & ActorRendererProps & { [key: string]: any }> = ({ component: Component, actor, isSelected, onSelect, ...props }) => (
    <Component onClick={onSelect} castShadow receiveShadow {...props}>
        <MaterialComponent actor={actor} isSelected={isSelected} />
    </Component>
);

export const BoxRenderer: React.FC<ActorRendererProps> = (props) => (
    <PrimitiveShape component={Box} {...props} />
);

export const SphereRenderer: React.FC<ActorRendererProps> = (props) => (
    <PrimitiveShape component={Sphere} {...props} />
);

export const CapsuleRenderer: React.FC<ActorRendererProps> = (props) => (
    <PrimitiveShape component={Capsule} args={[0.5, 1, 4, 8]} {...props} />
);

export const CylinderRenderer: React.FC<ActorRendererProps> = (props) => (
    <PrimitiveShape component={Cylinder} {...props} />
);

export const ConeRenderer: React.FC<ActorRendererProps> = (props) => (
    <PrimitiveShape component={Cone} {...props} />
);

export const TorusRenderer: React.FC<ActorRendererProps> = (props) => (
    <PrimitiveShape component={Torus} {...props} />
);

export const PlaneRenderer: React.FC<ActorRendererProps> = (props) => (
    <PrimitiveShape component={Plane} args={[5, 5]} rotation={[-Math.PI/2, 0, 0]} {...props} />
);
