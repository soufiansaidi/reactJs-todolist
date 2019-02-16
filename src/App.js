import React, { Component } from 'react';
import './index.css';

// section 

class App extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      isLoadedTodoList: false,
      todoList: [],
      filterID: false,
      filterTitle: false,
      filterStatut: false,
      user_id: 0,
      title: "",
      newTodoTitle: "",
      lengthTodo: 0,
      formStatut: "add",
    }
  }
  
  componentDidMount()
  {
    this.setState({ isLoadedTodoList: true })

    fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
    .then( resp => resp.json() )
    .then( data => this.setState({ todoList: data, isLoadedTodoList: false, lengthTodo: data.length }) )
    .catch( error => console.log( error ) )
  }

  editToForm = id => {
    const row = this.state.todoList.filter( item => {
      return item.id === id
    })
    this.setState({ user_id: row[0].id, title: row[0].title, formStatut: "edit" })
  }

  saveData = (e) => {
    e.preventDefault()

    let title = this.state.title
    let userID = this.state.user_id 

    if(title === "")
    {
      alert("Title required !!")
      return false
    }

    if( this.state.formStatut === "add" ){
      const newTodo = {
        "userId": 1,
        "id": this.state.lengthTodo + 1,
        "title": title,
        "completed": false,
      }
      this.setState({ todoList: [...this.state.todoList, newTodo], lengthTodo: this.state.lengthTodo + 1 })
    }else{
      const todoList = this.state.todoList.map(function(item){
        const itemRoll = {"userId": 1, "id": item.id, "title": title, "completed": item.completed}
        return userID === item.id ? itemRoll : item
      })      
      this.setState({ todoList, user_id: 0, formStatut: "add" })
    }

    this.setState({ title: "" })
  }

  TodoDelete = id => {
    const todoList = this.state.todoList.filter( item => {
      return item.id !== id
    })
    this.setState({ todoList })
  }

  todoSelected = (id) => {
    const todoList = this.state.todoList.map(function(item){
      const itemRoll = {"userId": 1, "id": item.id, "title": item.title, "completed": !item.completed}
      return id === item.id ? itemRoll : item
    })
    this.setState({ todoList })
  }

  handletitleChange = e => {
    this.setState({ title: e.target.value })
  }

  filterData = col => {
    switch (col) {
      case 'id' :

        if(this.state.filterID)
          this.state.todoList.sort( (a, b) => a.id > b.id ? 1 : -1 )
        else
          this.state.todoList.sort( (a, b) => a.id < b.id ? 1 : -1 )
        this.setState({ filterID: !this.state.filterID })

      break;
      case 'title' :

        if(this.state.filterTitle)
          this.state.todoList.sort( (a, b) => a.title > b.title ? 1 : -1 )
        else
          this.state.todoList.sort( (a, b) => a.title < b.title ? 1 : -1 )
        this.setState({ filterTitle: !this.state.filterTitle })

      break;
      default :

        if(this.state.filterStatut)
          this.state.todoList.sort( (a, b) => a.completed > b.completed ? 1 : -1 )
        else
          this.state.todoList.sort( (a, b) => a.completed < b.completed ? 1 : -1 )
        this.setState({ filterStatut: !this.state.filterStatut })

      break;
    }
  }

  render() {
    if(this.state.isLoadedTodoList) return <h1>Loading ...</h1>

    const dataTr = this.state.todoList.map( (todo, index) => 
      <div className="Rows" key={todo.id}>
        <span className="cols small"><input type="checkbox" checked={ todo.completed ? "checked" : "" } onChange={ () => this.todoSelected(todo.id)} /></span>
        <span className="cols small">{ todo.id }</span>
        <span className="cols large">{ todo.title }</span>
        <span className="cols medium">{ todo.completed ? "Done" : "Not yet" }</span>
        <span className="cols medium"><button className="buttonEdit" onClick={ () => this.editToForm(todo.id)}>Edit</button></span>
        <span className="cols medium"><button className="buttonDelete" onClick={ () => this.TodoDelete(todo.id)}>Delete</button></span>
      </div>
    )

    return (
      <div className="container">
        <div className="list">
          <div className="Rows">
            <span className="cols small">Select</span>
            <span className="cols small" onClick={ () => this.filterData('id') }>ID</span>
            <span className="cols large" onClick={ () => this.filterData('title') }>Title</span>
            <span className="cols medium" onClick={ () => this.filterData('completed') }>Statut</span>
            <span className="cols medium">Edit</span>
            <span className="cols medium">Delete</span>
          </div>
          { dataTr.length ? dataTr : <h3>No data here</h3> }
        </div>

        <div className="formAddTodo">
          <form onSubmit={  this.saveData }>
            <label>Title</label>
            <input type="text" name="title" value={ this.state.title } onChange={ this.handletitleChange } />
            
            <br /><br />
            <button type="submit">{ this.state.formStatut === "add" ? "Add Todo" : "Edit todo" }</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
