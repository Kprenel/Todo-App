'use strict';

// DOM
const $ = (selector) => {
  const elements = [...document.querySelectorAll(selector)];
  
  return elements.length === 1 ? elements[0] : elements;
}

function createElement(tag, props, children) {
  const element = document.createElement(tag);
  
  for (let prop in props) {
    if (prop in element) {
      element[prop] = props[prop];
      
      continue;
    }
    
    element.setAttribute(prop, props[prop]);
  }
  
  if (children) {
    [children]
      .flat()
      .forEach(child => {
        if (!is_object(child)) {
          element.innerHTML += child;

          return;
        }

      element.appendChild(child);
    });
  }
  
  return element;
}


// UTILS FUNCTIONS
const is_object = (obj) => {
  return typeof obj === 'object' && typeof obj !== null && !Array.isArray(obj);
}

function random_number(min, max) {
  if (min > max) [min, max] = [max, min];
  
  return Math.random() * (max - min + 1) + min;
}


// APP
class Todo {
  constructor() {
    this.DATA = new Map([
      [12, 'GABRIEL'],
      [32, 'LUIZ'],
      [1, 'KILDER']
    ]);
    
    // DOM
    this.list = $('ul');
    this.input = $('input');
    
    this.item = (id) => {
      // INPUT VALUE
      const input = createElement('input', 
        {
          readonly: 'readonly', 
          value: this.DATA.get(id)
        });
      
      const li = createElement('li', 
        { 
          'data-id': id,
          'data-edit': false,
        }, 
        [
          input,
          this.btn_edit(id),
          this.btn_remove(id),
        ]);
      
      return li;
    }
    
    this.btn_edit = (id) => {
      const btn = createElement('button', { className: `edit${id}`}, `
        <i class="fa fa-pen"></i>
      `);
      
      const fn_edit = () => {
        const li = $(`li[data-id='${id}']`);
        const icon = $(`.edit${id}`).querySelector('i');
        const input = $(`li[data-id="${id}"] input`);
        
        const readonly = input.getAttribute('readonly');
        
        //  TOGGLE
        icon.className = readonly ? 'fa fa-save' : 'fa fa-pen';
        li.dataset.edit = li.dataset.edit === 'false' ? true : false;
        
        if (readonly) {
          input.removeAttribute('readonly');
          
          return;
        } 
        
        this.edit({ id, value: input.value });
        
        input.setAttribute('readonly', 'readonly');
      }
      
      btn.addEventListener('click', fn_edit);
      
      return btn;
    }
    
    this.btn_remove = (id) => {
      const btn = createElement('button', {}, `
        <i class="fa fa-trash"></i>
      `);
      
      const fn_remove = () => {        
        this.remove(id);
      }
      
      btn.addEventListener('click', fn_remove);
      
      return btn;
    }
    
    // ACTIONS
    $('.save').addEventListener('click', () => this.save());
    
    this.input.addEventListener('keyup', ({ keyCode }) => {
        if (keyCode === 13) {
          this.save();
        }
    });
    
    $('.delete_all').addEventListener('click', () => {
      for (let [id, value] of this.DATA) {
        this.remove(id);
      }
    });
    
    // VALIDATIONS
    this.validations = {
      add: () => {
        const rules = [
          this.input.value.trim() !== '',
        ];
        
        const validate = rules.every(Boolean);
        
        if(!validate) {
          alert('Enter a text here');
        }
        
        return validate;
      }
    }
    
    this.render([...this.DATA.keys()]);
  }
  
  update() {
    $('pre').innerHTML = [...this.DATA].reduce((a, b) => {
      return `${a + b} </br>`;
    }, `[DATA LIST - Array] </br></br>`);
  }
  
  save() {
    // VALIDATIONS 
    const add_validation = this.validations.add();
    
    if (add_validation) {
      const id = ~~random_number(0, 100);
      const value = this.input.value;

      this.DATA.set(id, value); 
      
      // RESET
      this.input.value = '';

      this.render(id); 
    }
  }
  
  edit({id, value}) {
    this.DATA.set(id, value);
    
    this.update();
  }
  
  remove(id) {
    const li = $(`li[data-id="${id}"]`);
    
    if (li.dataset.edit === 'false') {
      li.remove();
      
      this.DATA.delete(id); 
      this.update();
      
      return;
    }
    
    alert(`Items are being edited - id(${id})`);
  }
  
  render(ids) {
    this.update();
    
    for (let id of [ids].flat()) {
      this.list.appendChild(this.item(id));
    } 
  }
}

new Todo();