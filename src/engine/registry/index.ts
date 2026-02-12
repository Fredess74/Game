import { registerRenderer, getRenderer } from './ActorRegistry';
import { BoxRenderer, SphereRenderer, CapsuleRenderer, CylinderRenderer, ConeRenderer, TorusRenderer, PlaneRenderer } from '../renderers/PrimitiveRenderer';
import { LightRenderer } from '../renderers/LightRenderer';
import { Humanoid } from '../Humanoid';
import { CubeCharacter } from '../CubeCharacter';
import React from 'react';

// Register standard shapes
registerRenderer('box', BoxRenderer);
registerRenderer('sphere', SphereRenderer);
registerRenderer('capsule', CapsuleRenderer);
registerRenderer('cylinder', CylinderRenderer);
registerRenderer('cone', ConeRenderer);
registerRenderer('torus', TorusRenderer);
registerRenderer('plane', PlaneRenderer);
registerRenderer('light', LightRenderer);

// Register characters
// Adapters for existing components if needed, or if they match props
// Humanoid expects: actor, isSelected, onClick
// ActorRendererProps provides: actor, isSelected, onSelect
// So we need an adapter
const HumanoidAdapter: any = (props: any) => React.createElement(Humanoid, { ...props, onClick: props.onSelect });
const CubeCharacterAdapter: any = (props: any) => React.createElement(CubeCharacter, { ...props, onClick: props.onSelect });

registerRenderer('humanoid', HumanoidAdapter);
registerRenderer('cube_character', CubeCharacterAdapter);

// Fallback for character type
registerRenderer('character', HumanoidAdapter);

export { getRenderer, registerRenderer };
import { ModelRenderer } from '../renderers/ModelRenderer';
import { SpriteRenderer } from '../renderers/SpriteRenderer';
import { VoxelRenderer } from '../renderers/VoxelRenderer';

registerRenderer('model', ModelRenderer);
registerRenderer('sprite', SpriteRenderer);
registerRenderer('voxel', VoxelRenderer);
