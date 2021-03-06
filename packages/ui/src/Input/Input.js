// @flow
import * as React from "react";
import { TextField } from "@rmwc/textfield";
import { FormElementMessage } from "@webiny/ui/FormElementMessage";
import pick from "lodash/pick";
import type { FormComponentProps } from "./../types";

type Props = FormComponentProps & {
    // If true, will pass native `event` to the `onChange` callback
    rawOnChange: boolean,

    // CSS class name that will be added to the component.
    className?: string,

    // Auto-focus input
    autoFocus?: boolean,

    // Component label.
    label?: string,

    // Is input disabled?
    disabled?: boolean,

    // Description beneath the input.
    description?: React.Node,

    // Placeholder is used with `fullwidth` prop instead of a `label`. `label` and `placeholder` are always mutually exclusive.
    placeholder?: string,

    // Type of input ()
    type?: string,

    // Converts input into a text area with given number of rows.
    rows?: number,

    // Creates an outline around input. Ignored if `fullwidth` is true.
    outlined?: boolean,

    // Creates a box around the input.
    box?: string,

    // Stretches the input to fit available width.
    fullwidth?: boolean,

    // A ref for the native input.
    inputRef?: React.Ref<any>,

    // A leading icon. Use `<InputIcon/>` component.
    icon?: React.Node,

    // A trailing icon. Use `<InputIcon/>` component.
    trailingIcon?: React.Node,

    // A callback that is executed when input focus is lost.
    onBlur?: (e: SyntheticInputEvent<HTMLInputElement>) => any,

    // A callback that is executed when key is pressed / held.
    onKeyDown?: (e: SyntheticInputEvent<HTMLInputElement>) => any,

    // A callback that is executed when key is pressed / held.
    onKeyPress?: (e: SyntheticInputEvent<HTMLInputElement>) => any,

    // A callback that is executed when key is released.
    onKeyUp?: (e: SyntheticInputEvent<HTMLInputElement>) => any,

    // A callback that is executed when input is focused.
    onFocus?: (e: SyntheticInputEvent<HTMLInputElement>) => any
};

/**
 * Use Input component to store short string values, like first name, last name, e-mail etc.
 * Additionally, with rows prop, it can also be turned into a text area, to store longer strings.
 */
class Input extends React.Component<Props> {
    static defaultProps = {
        rawOnChange: false
    };

    // Props directly passed to RMWC
    static rmwcProps = [
        "label",
        "type",
        "disabled",
        "placeholder",
        "outlined",
        "onKeyDown",
        "onKeyPress",
        "onKeyUp",
        "onFocus",
        "rootProps",
        "fullwidth",
        "inputRef",
        "className"
    ];

    onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const { onChange, rawOnChange } = this.props;
        if (!onChange) {
            return;
        }

        onChange(rawOnChange ? e : e.target.value);
    };

    onBlur = async (e: SyntheticInputEvent<HTMLInputElement>) => {
        const { validate, onBlur } = this.props;
        if (validate) {
            // Since we are accessing event in an async operation, we need to persist it.
            // See https://reactjs.org/docs/events.html#event-pooling.
            e.persist();
            await validate();
        }
        onBlur && onBlur(e);
    };

    render() {
        const {
            autoFocus,
            value,
            label,
            description,
            placeholder,
            rows,
            validation = { isValid: null },
            icon,
            trailingIcon,
            ...props
        } = this.props;

        let inputValue = value;
        if (value === null || typeof value === "undefined") {
            inputValue = "";
        }

        return (
            <React.Fragment>
                <TextField
                    {...pick(props, Input.rmwcProps)}
                    autoFocus={autoFocus}
                    textarea={Boolean(rows)}
                    value={inputValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    label={label}
                    icon={icon}
                    placeholder={(!label && placeholder) || undefined}
                    trailingIcon={trailingIcon}
                    rows={this.props.rows}
                />

                {validation.isValid === false && (
                    <FormElementMessage error>{validation.message}</FormElementMessage>
                )}
                {validation.isValid !== false && description && (
                    <FormElementMessage>{description}</FormElementMessage>
                )}
            </React.Fragment>
        );
    }
}

export { Input };
