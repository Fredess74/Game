import React from 'react';
import { Box } from '@react-three/drei';
import type { Actor } from '../types';
import { MaterialComponent } from './MaterialComponent';

interface CubeCharacterProps {
    actor: Actor;
    isSelected: boolean;
    onClick: (e: any) => void;
}

export const CubeCharacter: React.FC<CubeCharacterProps> = ({ actor, isSelected, onClick }) => {
    return (
        <group onClick={onClick}>
            {/* Head */}
            <Box args={[0.4, 0.4, 0.4]} position={[0, 1.4, 0]} castShadow>
                <MaterialComponent actor={actor} isSelected={isSelected} />
            </Box>
            {/* Body */}
            <Box args={[0.6, 0.8, 0.3]} position={[0, 0.8, 0]} castShadow>
                <MaterialComponent actor={actor} isSelected={isSelected} />
            </Box>
            {/* Arms */}
            <Box args={[0.2, 0.8, 0.2]} position={[0.4, 0.8, 0]} castShadow>
                <MaterialComponent actor={actor} isSelected={isSelected} />
            </Box>
             <Box args={[0.2, 0.8, 0.2]} position={[-0.4, 0.8, 0]} castShadow>
                <MaterialComponent actor={actor} isSelected={isSelected} />
            </Box>
        </group>
    );
};
