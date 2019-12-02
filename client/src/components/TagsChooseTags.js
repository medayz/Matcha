import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import axios from "axios";
const styleW = {
	width: "100%"
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags(props) {
	const [tags, setTags] = useState([]);

	useEffect(() => {
		try {
			axios
				.get("/api/users/whoami")
				.then(res => {
					axios
						.get(`/api/tags/get`)
						.then(res => {
							let tag = res.data.data;
							let obj = tag.map(t => {
								let o = {
									title: t.props.name
								};
								return o;
							});
							setTags(obj);
						})
						.catch(err => {});
				})
				.catch(err => {});
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<Autocomplete
			multiple
			id="checkboxes-tags-demo"
			options={tags}
			disableCloseOnSelect
			getOptionLabel={tag => tag.title}
			onChange={(e, array) => props.handleChange(array)}
			renderOption={(tag, { selected }) => (
				<React.Fragment>
					<Checkbox
						icon={icon}
						checkedIcon={checkedIcon}
						style={{ marginRight: 8 }}
						checked={selected}
					/>
					{tag.title}
				</React.Fragment>
			)}
			style={{ width: "100%" }}
			renderInput={params => (
				<TextField
					style={styleW}
					{...params}
					variant="outlined"
					label="Choose tags"
					placeholder="Tags"
					fullWidth
				/>
			)}
		/>
	);
}
