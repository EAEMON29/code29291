import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Barcode from 'react-barcode';
import bwipjs from 'bwip-js';

function App() {
  const [data, setData] = useState({
    dlNo: 'T8154407', firstName: 'PAYTON', lastName: 'DRAKE', suffix: 'NONE',
    address: '105 CABRILLO CT', city: 'LOMPOC', state: 'CA', zip: '934370000',
    dlClass: 'C', sex: 'M', donor: 'Yes', 
    dob: '01/09/1999', issueDate: '08/08/2025', expiryDate: '01/09/2030', 
    dd: '0808202539601/CCDF/50', 
    icn: '25344H64762880401',
    restrictions: 'NONE', endorsement: 'NONE', height: '69', weight: '178',
    limitedTerm: 'No', eyeDL: 'BLK', hairDL: 'BLK', photo: null
  });

  const frontRef = useRef(null);
  const backRef = useRef(null);
  const pdf417Ref = useRef(null);
  const topBarcodeRef = useRef(null);
  const previewSectionRef = useRef(null);

  // --- AAMVA STANDARD BARCODE ENCODING (Dropdown Sync Fixed) ---
  useEffect(() => {
    if (pdf417Ref.current) {
      const cleanDOB = data.dob.replace(/\//g, '');
      const cleanIssue = data.issueDate.replace(/\//g, '');
      const cleanExpiry = data.expiryDate.replace(/\//g, '');
      const cleanDD = data.dd.replace(/\//g, '');

      // Gender Mapping Fix: Data change hobar sathe sathe eta direct update hobe
      const genderCode = data.sex === 'M' ? '1' : '2';

      const aamvaText = `@ ANSI 636000080002DL00410278ZN03200011DL` + 
        `DAQ${data.dlNo}DCS${data.lastName}DAC${data.firstName}DADNONE` + 
        `DDF${data.suffix}DAG${data.address}DAI${data.city}DAJ${data.state}DAK${data.zip}` +
        `DBB${cleanDOB}DBD${cleanIssue}DBA${cleanExpiry}DBC${genderCode}` + // Dynamic DBC Tag
        `DAU0${data.height} in` + `DAW${data.weight}DAY${data.eyeDL}DAZ${data.hairDL}` +
        `DCF${data.icn}DCGUSA` + `DCG${data.dlClass}DBE${cleanDD}`;

      try {
        bwipjs.toCanvas(pdf417Ref.current, {
          bcid: 'pdf417',
          text: aamvaText,
          scale: 3, height: 12, eclevel: 4
        });
      } catch (e) { console.error("AAMVA Render Error:", e); }
    }
  }, [data]); // State change holei auto Barcode update hobe

  const generateRandom = () => {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randDL = alphabets.charAt(Math.floor(Math.random() * 26)) + Math.floor(1000000 + Math.random() * 9000000);
    const randomYear = 2024 + Math.floor(Math.random() * 3);
    
    const newIssueDate = `0${Math.floor(Math.random()*9)+1}/12/${randomYear}`;
    const newDOB = `10/28/${1980 + Math.floor(Math.random() * 25)}`;
    const newExpiryDate = `06/23/${randomYear + 5}`;
    const formattedZip = Math.floor(10000 + Math.random() * 90000).toString() + "0000";

    const randomSecureCode = Math.floor(10000 + Math.random() * 89999);
    const suffixCodes = ['AAFD', 'BBCE', 'CCDF'];
    const randomSuffix = suffixCodes[Math.floor(Math.random() * suffixCodes.length)];
    const generatedDD = `${newIssueDate.replace(/\//g, '')}${randomSecureCode}/${randomSuffix}/${Math.floor(Math.random() * 90) + 10}`;

    const addressPool = [
      { addr: '789 PINE RD', city: 'SAN DIEGO', state: 'CA' },
      { addr: '105 CABRILLO CT', city: 'LOMPOC', state: 'NY' },
      { addr: '516 ANSON CT', city: 'RONHERT PARK', state: 'TX' },
      { addr: '224 OAK STREET', city: 'ALBANY', state: 'FL' }
    ];
    const randomLoc = addressPool[Math.floor(Math.random() * addressPool.length)];

    const randomGender = Math.random() > 0.5 ? 'M' : 'F';

    setData({
      ...data,
      dlNo: randDL,
      firstName: randomGender === 'M' ? ['MICHAEL', 'ROBERT', 'JAMES', 'DAVID', 'KEVIN'][Math.floor(Math.random() * 5)] : ['EMILY', 'SARAH', 'JESSICA', 'LINDA', 'MARY'][Math.floor(Math.random() * 5)],
      lastName: ['SMITH', 'WILSON', 'MILLER', 'DAVIS', 'BROWN'][Math.floor(Math.random() * 5)],
      sex: randomGender,
      dob: newDOB, issueDate: newIssueDate, expiryDate: newExpiryDate,
      zip: formattedZip, address: randomLoc.addr, city: randomLoc.city, state: randomLoc.state,
      icn: Math.floor(Math.random()*10000000000000000).toString(),
      dd: generatedDD,
    });
  };

  const handleCreate = () => {
    previewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadBarcodes = async () => {
    const canvas1 = pdf417Ref.current;
    const link1 = document.createElement('a');
    link1.download = 'back_pdf417_hd.png';
    link1.href = canvas1.toDataURL("image/png");
    link1.click();

    setTimeout(() => {
      const barcodeCanvas = topBarcodeRef.current.querySelector('canvas');
      if (barcodeCanvas) {
        const link2 = document.createElement('a');
        link2.download = 'top_code128_hd.png';
        link2.href = barcodeCanvas.toDataURL("image/png");
        link2.click();
      }
    }, 500);
  };

  const downloadAllPng = async () => {
    const f = await toPng(frontRef.current, { pixelRatio: 3 });
    const b = await toPng(backRef.current, { pixelRatio: 3 });
    const save = (l, n) => { const a = document.createElement('a'); a.href = l; a.download = n; a.click(); };
    save(f, 'front_side.png'); setTimeout(() => save(b, 'back_side.png'), 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-[2.5rem] p-8 border border-slate-200">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h2 className="text-2xl font-black text-indigo-600 uppercase tracking-tighter italic">License Generator Dashboard Pro</h2>
          <button onClick={generateRandom} className="bg-slate-100 hover:bg-slate-200 px-6 py-2 rounded-xl font-bold border border-slate-300 transition-all">RANDOMIZE</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-2 flex flex-col items-center gap-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Photo</p>
            <label className="w-full aspect-[3/4] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 overflow-hidden shadow-inner group">
              <input type="file" className="hidden" onChange={(e) => setData({...data, photo: URL.createObjectURL(e.target.files[0])})} />
              {data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-indigo-300">UPLOAD</span>}
            </label>
          </div>

          <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
            <InputField label="DL Number" value={data.dlNo} onChange={v => setData({...data, dlNo: v.toUpperCase()})} />
            <InputField label="First Name" value={data.firstName} onChange={v => setData({...data, firstName: v.toUpperCase()})} />
            <InputField label="Last Name" value={data.lastName} onChange={v => setData({...data, lastName: v.toUpperCase()})} />
            <InputField label="Suffix" value={data.suffix} onChange={v => setData({...data, suffix: v.toUpperCase()})} />
            <div className="md:col-span-2"><InputField label="Address" value={data.address} onChange={v => setData({...data, address: v.toUpperCase()})} /></div>
            <InputField label="City" value={data.city} onChange={v => setData({...data, city: v.toUpperCase()})} />
            <InputField label="State" value={data.state} onChange={v => setData({...data, state: v.toUpperCase()})} />
            <InputField label="Zip code" value={data.zip} onChange={v => setData({...data, zip: v})} />
            <InputField label="Birth date" value={data.dob} onChange={v => setData({...data, dob: v})} />
            
            {/* --- DROPDOWN SYNC FIX --- */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Sex ⓘ</label>
              <select 
                className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-400 text-xs text-slate-700 shadow-sm transition-all"
                value={data.sex} 
                onChange={e => setData({...data, sex: e.target.value})}
              >
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
              </select>
            </div>

            <InputField label="Issue date" value={data.issueDate} onChange={v => setData({...data, issueDate: v})} />
            <InputField label="Expiry date" value={data.expiryDate} onChange={v => setData({...data, expiryDate: v})} />
            <InputField label="DD" value={data.dd} onChange={v => setData({...data, dd: v})} />
            <InputField label="ICN" value={data.icn} onChange={v => setData({...data, icn: v})} />
            <InputField label="Restrictions" value={data.restrictions} onChange={v => setData({...data, restrictions: v.toUpperCase()})} />
            <InputField label="Endorsement" value={data.endorsement} onChange={v => setData({...data, endorsement: v.toUpperCase()})} />
            <InputField label="DL Class" value={data.dlClass} onChange={v => setData({...data, dlClass: v.toUpperCase()})} />
            <InputField label="Height" value={data.height} onChange={v => setData({...data, height: v})} />
            <InputField label="Weight" value={data.weight} onChange={v => setData({...data, weight: v})} />
            <InputField label="Donor" value={data.donor} onChange={v => setData({...data, donor: v})} />
            <InputField label="Eye color" value={data.eyeDL} onChange={v => setData({...data, eyeDL: v.toUpperCase()})} />
            <InputField label="Hair color" value={data.hairDL} onChange={v => setData({...data, hairDL: v.toUpperCase()})} />
            <InputField label="Limited Term" value={data.limitedTerm} onChange={v => setData({...data, limitedTerm: v})} />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10 pt-10 border-t items-center">
          <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-2xl font-black shadow-lg uppercase transition-all">CREATE</button>
          <button onClick={downloadAllPng} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95">PNG DOWNLOAD</button>
          <button onClick={downloadBarcodes} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95">HD BARCODES ONLY</button>
        </div>
      </div>

      <div ref={previewSectionRef} className="mt-16 flex flex-col items-center gap-12 pb-20">
        <div ref={frontRef} className="relative w-[500px] h-[315px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-300">
           <img src="/front_template.png" className="absolute inset-0 w-full h-full object-fill" alt="template" />
           <div className="absolute top-[82px] left-[22px] w-[108px] h-[135px] overflow-hidden rounded-sm">
              {data.photo && <img src={data.photo} className="w-full h-full object-cover shadow-sm" alt="main" />}
           </div>
           <div className="absolute top-[160px] right-[55px] w-[75px] h-[95px] opacity-35 grayscale mix-blend-multiply brightness-110">
              {data.photo && <img src={data.photo} className="w-full h-full object-cover" alt="ghost1" />}
           </div>

           <div 
             className="absolute top-[205px] left-[35px] text-[22px] text-indigo-950 opacity-70" 
             style={{ fontFamily: "'SignatureFont', cursive", letterSpacing: '-1px', fontWeight: '300' }}
           >
             {data.firstName.toLowerCase()} {data.lastName.toLowerCase()}
           </div>

           <div className="absolute top-[80px] left-[155px] font-bold text-slate-800 uppercase leading-[1.1]">
              <p className="text-red-700 text-[13px] font-black italic tracking-tighter">{data.dlNo}</p>
              <p className="text-[14px] mt-1">{data.lastName}</p>
              <p className="text-[14px]">{data.firstName} {data.suffix !== 'NONE' ? data.suffix : ''}</p>
              <div className="text-[10px] mt-2 font-bold text-slate-600 leading-tight">
                <p>{data.address}</p>
                <p>{data.city}, {data.state} {data.zip}</p> 
              </div>
              <p className="mt-1 text-red-600 font-black tracking-widest uppercase italic">DOB {data.dob}</p>
              <div className="flex gap-2 mt-1 text-[8px] text-slate-500 font-black">
                 <span>SEX: {data.sex}</span> <span>HGT: {data.height}</span> <span>WGT: {data.weight}</span>
              </div>
           </div>
        </div>

        <div ref={backRef} className="relative w-[500px] h-[315px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-300">
           <img src="/back_template.png" className="absolute inset-0 w-full h-full object-fill" alt="template" />
           <div ref={topBarcodeRef} className="absolute top-[35px] left-[70px] p-1 bg-white inline-block">
              <Barcode value={`DL${data.dlNo}${data.state}`} width={2.2} height={55} displayValue={false} margin={0} renderer="canvas" />
           </div>
           <div className="absolute top-[92px] left-[115px]">
              <canvas ref={pdf417Ref} style={{ width: '330px', height: '110px' }}></canvas>
           </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">{label} ⓘ</label>
    <input className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-400 text-xs text-slate-700 shadow-sm transition-all" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default App;