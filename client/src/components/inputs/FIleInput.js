import {React, Component } from 'react'
import '../pages/addPhoto/AddPhoto.scss'

export class    FileInput extends Component {

    onChange = e => { 
        e.preventDefault();
        const { input: { onChange } } = this.props;
        onChange(e.target.files[0]);
    };

    render() {

        let {meta: {touched, error}, input, ...props} = this.props; // достаем value из props.input
        return (
            <>
                <input className="sized_button"
                    {...props.input}
                    id={props.id}
                    label="Input photos"
                    onChange={this.onChange}
                    type="file"
                    accept='.jpg, .png, .jpeg'
                />
                {touched && error && (
                    <input className="form__error form__text">
                        {error}
                    </input>
                )}
            </>
        )
    }
};