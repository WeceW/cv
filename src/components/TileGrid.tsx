import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Tile from './Tile';
import Button from './Button';

const ROWS = 20;
const COLS = 40;
const WELCOME_WORDS = 'Hell, world!';

const Container = styled.div<{ ejected: boolean }>`
  display: ${(p) => (p.ejected ? 'none' : 'flex')};
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  justify-content: stretch;
  height: 100vh;
  width: 100vw;

  button {
    position: fixed;
    z-index: 2;
    top: 1rem;
    right: 1rem;
  }
`;

const Row = styled.div`
  display: flex;
  flex: 1;
  justify-content: stretch;
`;

const CardGrid: React.FC = () => {
  const row: string[] = Array(COLS).fill('');
  const rows: string[][] = Array(ROWS).fill(row);

  const welcomeLineEmptyChars = COLS - WELCOME_WORDS.length;
  const welcomePrefix = Math.ceil(welcomeLineEmptyChars / 2);
  const welcomePostfix = Math.floor(welcomeLineEmptyChars / 2);
  const welcomeLine = [
    ...Array(welcomePrefix).fill(''),
    ...WELCOME_WORDS.split(''),
    ...Array(welcomePostfix).fill(''),
  ];

  rows.splice(ROWS / 2, 0, welcomeLine);

  const tiles: TileType[][] = rows.map((row, i) =>
    row.map((content, j) => ({
      content,
      index: i * rows.length + (j + 1),
    }))
  );

  const tileCount = rows.length * row.length;

  const [flippedCount, setFlippedCount] = useState(0);
  const [allFlipped, setAllFlipped] = useState(false);

  const isAllTilesFlipped = flippedCount >= tileCount;
  const flippedPercent = flippedCount / tileCount;
  const showFlipAllButtonThreshold = 0.02;
  const showFlipAllButton = flippedPercent >= showFlipAllButtonThreshold;
  const flipAllThreshold = 0.2;

  useEffect(() => {
    if (flippedPercent >= flipAllThreshold) setAllFlipped(true);
  }, [flipAllThreshold, flippedPercent]);

  const handleFlipAll = () => {
    setAllFlipped(true);
  };

  const handleAddToFlippedCount = useCallback(() => {
    setFlippedCount((count) => ++count);
  }, []);

  return (
    <Container ejected={isAllTilesFlipped}>
      {showFlipAllButton && (
        <Button text={'Flip all'} onClick={handleFlipAll} />
      )}

      {tiles.map((row, i) => (
        <Row key={i}>
          {row.map((tile: TileType, j: number) => (
            <Tile
              key={j}
              {...tile}
              allFlipped={allFlipped}
              onFlip={handleAddToFlippedCount}
            />
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default CardGrid;