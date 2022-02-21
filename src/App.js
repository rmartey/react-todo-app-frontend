import { useEffect, useState } from "react";
import { createTodo, deleteTodo, readTodos, updateTodo } from "./api";
import Preloader from "./components/preloader";

function App() {
	const [todo, setTodo] = useState({ title: "", content: "" });
	const [todos, setTodos] = useState(null);
	const [currentId, setCurrentId] = useState(0);

	useEffect(() => {
		let currentTodo =
			currentId !== 0
				? todos.find((todo) => todo._id === currentId)
				: { title: "", content: "" };
		setTodo(currentTodo);
	}, [currentId]);

	useEffect(() => {
		const fetchData = async () => {
			const result = await readTodos();
			setTodos(result.data);
			// console.log(result);
		};
		fetchData();
	}, [currentId]);

	const clear = () => {
		setCurrentId(0);
		setTodo({ title: "", content: "" });
	};

	useEffect(() => {
		const clearField = (e) => {
			if (e.keyCode === 27) {
				clear();
			}
		};
		window.addEventListener("keydown", clearField);
		return () => window.removeEventListener("keydown", clearField);
	}, []);

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (currentId === 0) {
			const result = await createTodo(todo);
			setTodos([...todos, result.data]);
			clear();
			// console.log(result);
		} else {
			await updateTodo(currentId, todo);

			clear();
		}
	};

	const removeTodo = async (id) => {
		await deleteTodo(id);
		const result = await readTodos();
		setTodos(result.data);
	};

	return (
		<div className="container">
			<div className="row">
				<form className="col s12" onSubmit={onSubmitHandler}>
					<div className="row">
						<div className="input-field col s6">
							<i className="material-icons prefix">title</i>
							<input
								id="icon_prefix"
								type="text"
								className="validate"
								onChange={(e) => {
									setTodo({ ...todo, title: e.target.value });
								}}
								value={todo.title}
							/>
							<label htmlFor="icon_prefix">Title</label>
						</div>
						<div className="input-field col s6">
							<i className="material-icons prefix">description</i>
							<input
								id="description"
								type="tel"
								className="validate"
								onChange={(e) => {
									setTodo({ ...todo, content: e.target.value });
								}}
								value={todo.content}
							/>
							<label htmlFor="description">Content</label>
						</div>
					</div>
					<div className="row right-align">
						<button className="waves-effect waves-light btn">Submit</button>
					</div>
				</form>
				{!todos ? (
					<Preloader />
				) : todos.length > 0 ? (
					<ul classname="collection">
						{todos.map((todo) => (
							<li key={todo._id} className="collection-item">
								<div>
									<h5>{todo.title}</h5>
									<p>
										{todo.content}
										<a href="#!" className="secondary-content">
											<i
												className="material-icons"
												onClick={() => setCurrentId(todo._id)}
											>
												edit
											</i>{" "}
											<i
												className="material-icons"
												onClick={() => removeTodo(todo._id)}
											>
												delete
											</i>
										</a>
									</p>
								</div>
							</li>
						))}
					</ul>
				) : (
					<div>
						<h4>Nothing to do</h4>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
