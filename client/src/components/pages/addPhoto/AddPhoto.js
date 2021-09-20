import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { FileInput } from '../../inputs/FIleInput';
import './AddPhoto.scss'

const AddPhoto = () => {


    const renderMembers = ({fields}) => (
        <div>
            <button className="sized_button" style={{
                background: 'blue'
            }} type="button" onClick={ () => fields.push()}>Add</button>
            {fields.map((member, index) =>
                <div key={index+1}>
                    <Field  name={member} component={FileInput} label="Choose photos" />
                </div>
            )}
        </div>
    )


    return (<div>
        <FieldArray name="photos" component={renderMembers} label="Choose photos" />
                    <button className="sized_button" >Submit</button>
    </div>)
}

export default AddPhoto;