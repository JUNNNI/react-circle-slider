import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrevious } from 'react-use';
import * as Styles from './CircleSlider.styles';

type Props = {
    angle: number;
    clockwise?: boolean;
    roundSize?: number;
    handleSize?: number;
    stepper?: number;
    zeroStartFrom?: 'top' | 'bottom' | 'left' | 'right';
    isAngleVisible?: boolean; // Shows the angle in the middle of the round
    fontSizeAngle?: string; // Requires `isAngleVisble` to be enabled
    roundColor?: string;
    roundThickness?: number;
    onSliderUp?: (angle: number) => void; // Only once user unpresses the handle
    onSliderMove?: (angle: number) => void; // Every time the value is changing
};

export const CircleSlider = ({
    angle = 0,
    clockwise = true,
    zeroStartFrom = 'top',
    stepper = 0,
    isAngleVisible = true,
    roundSize = 36,
    handleSize = 8,
    roundColor = '#5c69ff',
    roundThickness = 2,
    fontSizeAngle = '10px',
    onSliderUp,
    onSliderMove,
}: Props) => {
    const startOffset = getStartOffset(zeroStartFrom);
    const handleEl = useRef<HTMLDivElement>(null!);
    const containerEl = useRef<HTMLDivElement>(null!);

    const [outputAngle, setOutputAngle] = useState(angle);
    const [isHolding, setIsHolding] = useState(false);
    const prevIsHolding = usePrevious(isHolding);

    const formatInputAngle = useCallback(
        (angle: number) => {
            const rawAngle = clockwise
                ? modulo(Math.round(angle) - 360 + startOffset, 360)
                : modulo(360 - Math.round(angle) + startOffset, 360);
            return rawAngle;
        },
        [clockwise, startOffset],
    );

    const formatOutputAngle = useCallback(
        (angle: number) => {
            const outputAngle = clockwise
                ? modulo(360 + Math.round(angle) - startOffset, 360)
                : modulo(360 - Math.round(angle) + startOffset, 360);
            return outputAngle;
        },
        [clockwise, startOffset],
    );

    const [inputAngle, setInputAngle] = useState(formatInputAngle(angle));

    useEffect(() => {
        setInputAngle(formatInputAngle(angle));
        setOutputAngle(angle);
    }, [angle, formatInputAngle]);

    const getCenter = () => {
        const rect = containerEl.current.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
    };

    const radToDeg = (rad: number) => {
        return rad * (180 / Math.PI);
    };

    const getRawAngle = useCallback((e: MouseEvent) => {
        const pivot = getCenter();
        const mouse = {
            x: e.clientX,
            y: e.clientY,
        };

        return radToDeg(Math.atan2(mouse.y - pivot.y, mouse.x - pivot.x)) % 360;
    }, []);

    const onUserMovesHandle = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            let rawAngle = getRawAngle(e);

            if (stepper) {
                rawAngle = Math.ceil(rawAngle / stepper) * stepper;
            }

            setInputAngle(rawAngle);
            const editedOutputAngle = formatOutputAngle(rawAngle);
            setOutputAngle(editedOutputAngle);

            onSliderMove?.(editedOutputAngle);
        },
        [formatOutputAngle, getRawAngle, onSliderMove, stepper],
    );

    const onUnPressHandle = useCallback(
        (e: MouseEvent) => {
            document.documentElement.classList.remove('grabbing');
            document.removeEventListener('mousemove', onUserMovesHandle, false);

            // @ts-ignore
            e.currentTarget!.removeEventListener('mouseup', onUnPressHandle, false);
            setIsHolding(false);
        },
        [onUserMovesHandle],
    );

    useEffect(() => {
        if (!isHolding && prevIsHolding && outputAngle !== angle) {
            onSliderUp?.(outputAngle);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHolding, onSliderUp]);

    // User presses handle
    const onUserPressHandle = useCallback(
        (e: MouseEvent) => {
            e.preventDefault(); // Prevent text selection

            if (!isHolding) {
                setIsHolding(true);
                document.documentElement.classList.add('grabbing');

                // User moves handle
                document.addEventListener('mousemove', onUserMovesHandle, false);
                // User unpresses handle
                document.addEventListener('mouseup', onUnPressHandle, false);
            }
        },
        [isHolding, setIsHolding, onUserMovesHandle, onUnPressHandle],
    );

    useEffect(() => {
        const currentHandleEl = handleEl.current;
        currentHandleEl.addEventListener('mousedown', onUserPressHandle);

        return () => {
            currentHandleEl.removeEventListener('mousedown', onUserPressHandle);
        };
    }, [onUnPressHandle, onUserMovesHandle, onUserPressHandle]);

    return (
        <Styles.Container ref={containerEl}>
            {isAngleVisible && <Styles.Text fontSize={fontSizeAngle}>{outputAngle}°</Styles.Text>}
            <Styles.Round size={roundSize} borderColor={roundColor} borderSize={roundThickness}>
                <Styles.HandleContainer angle={inputAngle}>
                    <Styles.Handle isHolding={isHolding} ref={handleEl} size={handleSize} />
                </Styles.HandleContainer>
            </Styles.Round>
        </Styles.Container>
    );
};

const modulo = (n: number, m: number) => {
    return ((n % m) + m) % m;
};

const getStartOffset = (position: Props['zeroStartFrom']) => {
    switch (position) {
        case 'left':
            return 180;
        case 'bottom':
            return 90;
        case 'right':
            return 0;
        default: // default is top
            return 270;
    }
};
