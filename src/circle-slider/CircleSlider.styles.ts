import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    text-align: center;
    position: relative;
    align-items: center;
    justify-content: center;
`;

type RoundProps = {
    size: number;
    borderSize: number;
    borderColor: string;
};

export const Round = styled.div<RoundProps>`
    display: block;
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
    border-radius: 50%;
    border: ${({ borderSize, borderColor }) => `${borderSize}px solid ${borderColor}`};
    position: relative;
`;

type HandleContainerProps = {
    angle: number;
};

export const HandleContainer = styled.div<HandleContainerProps>`
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    margin-top: -1px;
    transform: ${({ angle }) => `rotate(${angle}deg);`};
`;

type HandleProps = {
    size: number;
    isHolding: boolean;
};

export const Handle = styled.div<HandleProps>`
    cursor: ${({ isHolding }) => (!isHolding ? 'grab' : 'grabbing')};
    position: absolute;
    right: ${({ size }) => `-${size / 2 + 1}px`};
    transform: translateY(-50%);
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
    border-radius: 100%;
    background: ${({ isHolding }) => (!isHolding ? '#fff' : '#000')};
    box-shadow: rgb(255 255 255 / 20%) 0 0px 0px 3px;
    transition: background ease-in-out 0.2s;
    &:hover {
        background: #000;
    }
`;

type TextProps = {
    fontSize?: string;
};

export const Text = styled.p<TextProps>`
    position: absolute;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    line-height: 0;
    font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : `14px`)};
`;
