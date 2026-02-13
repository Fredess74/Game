import React from 'react';
import { registerRenderer, getRenderer } from './ActorRegistry';
import { BoxRenderer, SphereRenderer, CapsuleRenderer, CylinderRenderer, ConeRenderer, TorusRenderer, PlaneRenderer } from '../renderers/PrimitiveRenderer';
import { LightRenderer } from '../renderers/LightRenderer';
import { Humanoid } from '../Humanoid';
import { ModelRenderer } from '../renderers/ModelRenderer';
import { SpriteRenderer } from '../renderers/SpriteRenderer';
import { VoxelRenderer } from '../renderers/VoxelRenderer';
import { ModularCharacter } from '../ModularCharacter';

// Register standard shapes
registerRenderer('box', BoxRenderer);
registerRenderer('sphere', SphereRenderer);
registerRenderer('capsule', CapsuleRenderer);
registerRenderer('cylinder', CylinderRenderer);
registerRenderer('cone', ConeRenderer);
registerRenderer('torus', TorusRenderer);
registerRenderer('plane', PlaneRenderer);
registerRenderer('light', LightRenderer);

// Adapters
const HumanoidAdapter: any = (props: any) => React.createElement(Humanoid, { ...props, onClick: props.onSelect });
const ModularCharacterAdapter: any = (props: any) => React.createElement(ModularCharacter, { ...props, onClick: props.onSelect });

// Register characters
registerRenderer('humanoid', HumanoidAdapter);

// MAIN CHARACTER RENDERER
registerRenderer('character', ModularCharacterAdapter);

registerRenderer('prop', ModelRenderer); // Use ModelRenderer for props
registerRenderer('model', ModelRenderer);
registerRenderer('sprite', SpriteRenderer);
registerRenderer('voxel', VoxelRenderer);

export { getRenderer, registerRenderer };
