
import React, {useState, useEffect} from "react";
import { useDispatch } from 'react-redux';
import { submit } from '../../actions/actions';

const EnvVariablesForm = () => {
  const [KovanNodeValue, setKovanNodeValue] = useState('');
  const [MainNetValue, setMainNetValue] = useState('');
  const [MainNetSubGraphValue, setMainNetSubGraphValue] = useState('');
  const [KovanSubGraphValue, setKovanSubGraphValue] = useState('');
  const [MainNetPriKeyValue, setMainNetPriKeyValue] = useState('');
  const [KovanNetPriKeyValue, setKovanNetPriKeyValue] = useState('');
  const [EnzymeVaultValue, setEnzymeVaultValue] = useState('');
  const dispatch = useDispatch();

  useEffect(  () => {
    console.log('EnvVariablesForm component did mount');
    }, [])

  const handleForm = (e: any) => {
    e.preventDefault();

    const EnvVariables = {
      KovanNodeValue: KovanNodeValue,
      MainNetValue: MainNetValue,
      MainNetSubGraphValue: MainNetSubGraphValue,
      KovanSubGraphValue: KovanSubGraphValue,
      MainNetPriKeyValue: MainNetPriKeyValue,
      KovanNetPriKeyValue: KovanNetPriKeyValue,
      EnzymeVaultValue: EnzymeVaultValue
    };
    
    dispatch(submit(EnvVariables));
    setKovanNodeValue("");
    setMainNetValue("");
    setMainNetSubGraphValue("");
    setKovanSubGraphValue("");
    setMainNetPriKeyValue("");
    setKovanNetPriKeyValue("");
    setEnzymeVaultValue("");
  }

  return <>
    <div className="form-group fg--search">
      <form onSubmit={handleForm}>
        <input className="input" onSubmit={handleForm} type="text" value={KovanNodeValue} placeholder="KovanNodeEndpoint" onChange={(e)=>setKovanNodeValue(e.target.value)} />
        <br />
        <input className="input" onSubmit={handleForm} type="text" value={KovanSubGraphValue} placeholder="KovanSubGraphEndpoint" onChange={(e)=>setKovanSubGraphValue(e.target.value)} />
        <br />
        <input className="input" onSubmit={handleForm} type="text" value={KovanNetPriKeyValue} placeholder="KovanNetPrivateKey" onChange={(e)=>setKovanNetPriKeyValue(e.target.value)} />
        <br />
        <input className="input" onSubmit={handleForm} type="text" value={EnzymeVaultValue} placeholder="EnzymeVaultAddress" onChange={(e)=>setEnzymeVaultValue(e.target.value)} />
        <br />
        <input className="input" onSubmit={handleForm} type="text" value={MainNetValue} placeholder="MainNetEndpoint" onChange={(e)=>setMainNetValue(e.target.value)} />
        <br />
        <input className="input" onSubmit={handleForm} type="text" value={MainNetSubGraphValue} placeholder="MainNetSubGraphEndpoint" onChange={(e)=>setMainNetSubGraphValue(e.target.value)} />
        <br />
        <input className="input" onSubmit={handleForm} type="text" value={MainNetPriKeyValue} placeholder="MainNetPrivateKey" onChange={(e)=>setMainNetPriKeyValue(e.target.value)} />
        <br />
        <button className="submit-button" type="submit" >Submit</button>
      </form>
    </div>
  </>;
};

export default EnvVariablesForm;