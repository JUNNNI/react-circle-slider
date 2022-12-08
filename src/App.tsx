import { useEffect, useState } from 'react';
import { CircleSlider } from './circle-slider/CircleSlider';
import './App.css';
import styled from 'styled-components';

const App = () => {
    const [angle, setAngle] = useState(45);

    const onSliderUp = (editedAngle: number) => {
        // setAngle(editedAngle);
    };

    const onSliderMove = (editedAngle: number) => {
        setAngle(editedAngle);
    };

    return (
        <Container>
            <Content>
                <Title>{angle}°</Title>
                <Button onClick={() => setAngle(90)}>Update to 90°</Button>
                <Button onClick={() => setAngle((angle) => angle + 10)}>Update +10°</Button>
            </Content>

            <CirclesContainer>
                <CircleSlider
                    roundSize={80}
                    handleSize={15}
                    roundThickness={5}
                    angle={angle}
                    fontSizeAngle="20px"
                    onSliderMove={onSliderMove}
                    onSliderUp={onSliderUp}
                />
                <CircleSlider angle={angle} onSliderMove={onSliderMove} onSliderUp={onSliderUp} />
            </CirclesContainer>

            <InputNumber min={0} max={360} value={angle} onChange={setAngle} />
        </Container>
    );
};

export default App;

type InputNumberProps = {
    onChange: (value: number) => void;
    value: number;
    min: number;
    max: number;
};

const InputNumber = ({ onChange, value, min = 0, max }: InputNumberProps) => {
    const [number, setNumber] = useState(value);

    useEffect(() => {
        setNumber(value);
    }, [value]);

    const onChangeEnhanced = (e: any) => {
        const editedNumber = e.target.value;

        const constrainedNumber = Math.max(min, Math.min(max, Number(editedNumber)));

        setNumber(constrainedNumber);
        onChange(constrainedNumber);
    };

    return <Input type="number" min={min} max={max} value={number} onChange={onChangeEnhanced} />;
};

const Title = styled.h1`
    margin: 0;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
`;

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const CirclesContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const Button = styled.button`
    margin-right: 0;
`;

const Input = styled.input`
    font-size: 18px;
    padding: 8px 8px;
    border-radius: 8px;
    border: 2px solid #1a1a1a;
`;
