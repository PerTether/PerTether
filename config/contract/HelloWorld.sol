pragma solidity ^0.4.24;

contract HelloWorld{

    string name;

    function HelloWorld(){
       name="init name";
    }

    function get()constant returns(string){
        return name;
    }

    function set(string n){
    	name = n;
    }
}
