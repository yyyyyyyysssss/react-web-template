import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Select, Table, Typography } from 'antd';
import { RequestMethod } from '../../../../enums';


var __rest =
    (this && this.__rest) ||
    function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

const AuthorityEditableCell = _a => {
    var { editing, dataIndex, title, record, index, children } = _a,
        restProps = __rest(_a, [
            'editing',
            'dataIndex',
            'title',
            'record',
            'index',
            'children',
        ])

    const methodOptions = Object.entries(RequestMethod).map(([key, value]) => ({
        label: key,
        value: value,
    }))

    const handleChange = (value) => {
        
    }

    return (
        <td {...restProps}>
            {editing ?
                (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: '不能为空',
                            },
                        ]}
                    >
                        {
                            dataIndex === 'method' ?
                                (
                                    <Select
                                        style={{ width: 100 }}
                                        onChange={handleChange}
                                        options={methodOptions}
                                    />
                                )
                                :
                                (
                                    <Input />
                                )
                        }

                    </Form.Item>
                )
                :
                (children)
            }
        </td>
    )
}

export default AuthorityEditableCell