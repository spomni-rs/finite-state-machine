

const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};


class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      if (!config){
        throw new Error('The config is not passed.')
      }
      
      this._config = config;
      this._history = [];
      this._historyPointer = -1;
      this._state = config.initial;
    }
    
    get _state(){
      return this._history[this._historyPointer];
    }
    
    set _state(state){
      this._historyPointer++;
      this._history.splice(this._historyPointer);
      this._history.push(state)
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (!this._config.states[state]){
        throw new Error(`The state "${state} isn't defined."`)
      }
      this._state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      let newState = this._config.states[this._state].transitions[event];
      this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.changeState(this._config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      let states = Object.keys(this._config.states);

      if (!event){
        return states
      }
      
      return states.filter((state) => {
        return !!this._config.states[state].transitions[event];
      });
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (this._historyPointer === 0){
        return false;
      }

      this._historyPointer--;
      
      return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (this._history.length <= this._historyPointer + 1){
        return false;
      }
      
      this._historyPointer++;
      
      return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this._history.splice(1);
      this._historyPointer = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/