import React, { Component } from 'react';

import '../App.css';
import '../css/notes.css';

import desenfocar2 from '../desenfocar2.jpg';
import agregar from '../agregar.png';
import libreta from '../libreta.png';
import cerrar from '../cerrar.png';

const { notes } = { "notes": [] };

function x_doc(id){
    return document.getElementById(id);
}

let numero = 1;

let url = "https://ultimateos.com/sweaghe";

class Notes extends Component{

	constructor(){
		super();

		this.state = {
			notes,
			titulonotes: '',
			contnotes: '',
			domnotes: '',
			width: 0,
			height: 0,
			cambiar: 0,
			code: ''
		}

		this.handerNuevo = this.handerNuevo.bind(this);
		this.handlerInput = this.handlerInput.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handlerDOMs = this.handlerDOMs.bind(this);
		this.handlerNotes = this.handlerNotes.bind(this);
		this.handlerAddNotes = this.handlerAddNotes.bind(this);
		this.handlerNoteUpdate = this.handlerNoteUpdate.bind(this);
		this.handlerNoteDelete = this.handlerNoteDelete.bind(this);
	}

	componentDidMount() {
		const input = { unique: "" };
		fetch(url + "/xnote/getNotes", {
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerNotes(response))
		.catch(error => console.error('Error:', error));

	  	this.updateWindowDimensions();
	  	window.addEventListener('resize', this.updateWindowDimensions);
	}

	handlerNotes(respuesta){
		this.setState({
			notes: [...respuesta.notes, ...this.state.notes]
		});
	}

	componentWillUnmount() {
	  	window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
	  	this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	handerNuevo(){
		var formData = new FormData();
        formData.append("titulo", "Ingresa un titulo");
        formData.append("contenido", "Ingresa un contenido");

		fetch(url + "/xnote/setNotes", {
			method: 'POST',  
			body: formData
		}).then(res => res.json())
		.then(response => this.handlerAddNotes(response))
		.catch(error => console.error('Error:', error));
	}

	handlerAddNotes(respuesta){
		if(respuesta.notes[0].mensaje){
			let idnotes = parseInt(this.state.notes.length);
			const { notae } = { "notae": [{"id": idnotes, "code": respuesta.notes[0].code, "titulo": "Ingresa un titulo", "contenido": "Ingresa un contenido"}] };

			this.setState({
				notes: [...notae, ...this.state.notes]
			});
		}
	}

	handlerActual(id, code, titulo, contenido){
		this.setState({
			titulonotes: titulo,
			contnotes: contenido,
			domnotes: id,
			code: code
		});
	}

	handlerInput(e){
		const {value, name} = e.target;
		var contensform = value;
		var contensformsimple = contensform.replace(/(<([^>]+)>)/ig, '');

		this.setState({
			[name]: contensformsimple
		});
	}

	handlerSave(){
		if(this.state.titulonotes != '' && this.state.contnotes != ''){
			var formData = new FormData();
			formData.append("code", this.state.code);
	        formData.append("titulo", this.state.titulonotes);
        	formData.append("contenido", this.state.contnotes);

			fetch(url + "/xnote/updateNotes", {
				method: 'POST',  
				body: formData
			}).then(res => res.json())
			.then(response => this.handlerNoteUpdate(response))
			.catch(error => console.error('Error:', error));
		}
	}

	handlerNoteUpdate(respuesta){
		if(respuesta.notes[0].mensaje){
			const { notes } = this.state;
		    notes[this.state.domnotes].titulo = this.state.titulonotes;
		    notes[this.state.domnotes].contenido = this.state.contnotes;

		    this.setState({
		    	notes
		    });
		}
	}

	handlerDOMs(){
		this.setState({
			cambiar: this.state.height
		})
	}

	removeTodo(index, code) {
		var formData = new FormData();
		formData.append("code", code);

		fetch(url + "/xnote/deleteNotes", {
			method: 'POST',  
			body: formData
		}).then(res => res.json())
		.then(response => this.handlerNoteDelete(response, index))
		.catch(error => console.error('Error:', error));
  	}

  	handlerNoteDelete(respuesta, index){
  		console.log(respuesta, index);
  		if(respuesta.notes[0].mensaje){
  			this.setState({
	      		notes: this.state.notes.filter((e, i) => {
	        		return i !== index
	      		})
	    	});
  		}
  	}

	render(){
		let fondo = { background: 'url(' + desenfocar2 + ') center center / cover no-repeat' };
		let a = 0, b = 1, c = 2, d = 3, e = 4, f = 5;

		const funcion = function (params){
			const comprimido = this.state.notes.map((note, i) => {
				if(params.valor == i){
					return(
						<div className="notes2" key={i}>
							<div className="contencerrar" onClick={this.removeTodo.bind(this, i, note.code)}>
								<img src={cerrar} className="imgnotes" />
							</div>
							<div id={"cont-" + i} className="contenidonotes" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onClick={this.handlerActual.bind(this, i, note.code, note.titulo, note.contenido)}>{note.titulo}</div>
						</div>
					)
				}else if((parseInt(params.valor) + numero) == i){
					params.valor = (parseInt(params.valor) + numero);
					return(
						<div className="notes2" key={i}>
							<div className="contencerrar" onClick={this.removeTodo.bind(this, i, note.code)}>
								<img src={cerrar} className="imgnotes" />
							</div>
							<div id={"cont-" + i} className="contenidonotes" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onClick={this.handlerActual.bind(this, i, note.code, note.titulo, note.contenido)}>{note.titulo}</div>
						</div>
					)
				}
			});

			return comprimido;
		}.bind(this);

		const rowsss = function (paramss){
			if(this.state.cambiar != this.state.width){
				if(this.state.width >= 1201){
					numero = 6;
					return(
						<div className="row sinmarging">
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: a})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: b})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: c})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: d})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: e})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: f})}</div>
						</div>
					)
				}if(this.state.width >= 769 && this.state.width <= 1200){
					numero = 6;
					return(
						<div className="row sinmarging">
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: a})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: b})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: c})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: d})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: e})}</div>
							<div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 notes">{funcion({valor: f})}</div>
						</div>
					)
				}if(this.state.width >= 577 && this.state.width <= 768){
					numero = 4;
					return(
						<div className="row sinmarging">
							<div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 notes">{funcion({valor: a})}</div>
							<div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 notes">{funcion({valor: b})}</div>
							<div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 notes">{funcion({valor: c})}</div>
							<div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 notes">{funcion({valor: d})}</div>
						</div>
					)
				}if(this.state.width >= 0 && this.state.width <= 576){
					numero = 1;
					return(
						<div className="row sinmarging">
							<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 notes">{funcion({valor: a})}</div>
						</div>
					)
				}
			}
		}.bind(this);

		return (
			<div className="container-fluid cajas" style={fondo} onClick={this.handlerDOMs}>
				<div className="col-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 notes">
					<a href="#?" className="ancla" onClick={this.handerNuevo}>
						<img src={agregar} className="imgnotas" />
					</a>
				</div>

				{rowsss()}

				<div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				  <div className="modal-dialog" role="document">
				    <form className="modal-content">
				      <div className="modal-header">
				        <h5 className="modal-title" id="exampleModalCenterTitle">Detalles</h5>
				        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
				          <span aria-hidden="true">&times;</span>
				        </button>
				      </div>
				      <div className="modal-body">
				      	<input id="titulonotes" name="titulonotes" value={this.state.titulonotes} className="inputnotes" onChange={this.handlerInput} />
				      </div>
				      <div className="modal-body">
				      	<textarea id="contnotes" name="contnotes" value={this.state.contnotes} className="textareanotes" onChange={this.handlerInput} />
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
				        <button type="button" className="btn btn-primary" onClick={this.handlerSave.bind(this)}>Guardar</button>
				      </div>
				    </form>
				  </div>
				</div>
			</div>
		)
	}
}

export default Notes;