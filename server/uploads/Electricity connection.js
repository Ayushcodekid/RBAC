import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import './applicationforms.css';
import back from "../Document_page/doc_images/back1.png";
import HeaderBar from '../HeaderBar';

const ElectricityConnectionForm = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownItemClick = (item) => {
        console.log(item);
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        houseno: '',
        floor: '',
        street: '',
        cross: '',
        main: '',
        city: '',
        area: '',
        zip: '',
        phno: '',
        landmark: '',
        typeofactivity: '',
        loadRequirement: '',
        meterNumber: '',
        lecname:'',
        lecaddress:'',
        placeofdeclaration: '',
        dateofdeclaration: '',
    });

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('electricityFormData'));
        if (savedData) {
            setFormData(savedData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const saveForm = () => {
        localStorage.setItem('electricityFormData', JSON.stringify(formData));
    };

    const drawTextWithSpacing = (page, text, options) => {
        if (typeof text !== 'string') return;
        const { x, y, font, size, color, spacing } = options;
        let currentX = x;
    
        for (let char of text) {
            page.drawText(char, { x: currentX, y, size, font, color });
            currentX += font.widthOfTextAtSize(char, size) + spacing;
        }
    };
    
    const generatePDF = async () => {
        const existingPdfBytes = await fetch('/Electricity connection.pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);
    
        const fontBytes = await fetch('/Arial.ttf').then(res => res.arrayBuffer());
        const font = await pdfDoc.embedFont(fontBytes);
    
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];
        const { width, height } = firstPage.getSize();
    
        const textOptions = {
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
            spacing: 7, // Adjust this value as needed
        };
    
        drawTextWithSpacing(firstPage, formData.name, { ...textOptions, x: 109, y: height - 252 });
        drawTextWithSpacing(firstPage, formData.address, { ...textOptions, x: 62, y: height - 283 });
        drawTextWithSpacing(firstPage, formData.houseno, { ...textOptions, x: 230, y: height - 427 });
        drawTextWithSpacing(firstPage, formData.floor, { ...textOptions, x: 437, y: height - 428 });
        drawTextWithSpacing(firstPage, formData.street, { ...textOptions, x: 143, y: height - 444 });
        drawTextWithSpacing(firstPage, formData.cross, { ...textOptions, x: 338, y: height - 445 });
        drawTextWithSpacing(firstPage, formData.main, { ...textOptions, x: 454, y: height - 445});
        drawTextWithSpacing(firstPage, formData.city, { ...textOptions, x: 375, y: height - 463 });
        drawTextWithSpacing(firstPage, formData.area, { ...textOptions, x: 154, y: height - 462 });
        drawTextWithSpacing(firstPage, formData.zip, { ...textOptions, x: 90, y: height - 476 });
        drawTextWithSpacing(firstPage, formData.phno, { ...textOptions, x: 336, y: height - 478 });
        drawTextWithSpacing(firstPage, formData.landmark, { ...textOptions, x: 128, y: height - 493 });
        drawTextWithSpacing(firstPage, formData.typeofactivity, { ...textOptions, x: 63, y: height - 154, spacing: 0 });
        drawTextWithSpacing(firstPage, formData.loadRequirement, { ...textOptions, x: 180, y: height - 557 });
        drawTextWithSpacing(firstPage, formData.meterNumber, { ...textOptions, x: 373, y: height - 592});
        drawTextWithSpacing(firstPage, formData.lecname, { ...textOptions, x: 63, y: height - 755});
        drawTextWithSpacing(firstPage, formData.lecaddress, { ...textOptions, x: 63, y: height - 786});
        drawTextWithSpacing(secondPage, formData.dateofdeclaration, { ...textOptions, x: 109, y: height - 194});
        drawTextWithSpacing(secondPage, formData.placeofdeclaration, { ...textOptions, x: 109, y: height - 210});
    
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Electricity_Connection_Form.pdf';
        link.click();
    };
    
    

    return (
        <div className='application-form'>
            <HeaderBar />
            <div className='back-btn-forms-page'>
                <Link to="/document"><img className='back-btn-form' src={back} alt=""></img></Link>
            </div>
            <h2>Electricity Connection Form</h2>
            <form>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} /><br />

                <label>Address for communication:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} /><br />
                
                <label>House/Flat no.:</label>
                <input type="text" name="houseno" value={formData.houseno} onChange={handleChange} /><br />

                <label>Floor:</label>
                <input type="text" name="floor" value={formData.floor} onChange={handleChange} /><br />

                <label>Street Name:</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} /><br />

                <label>Cross:</label>
                <input type="text" name="cross" value={formData.cross} onChange={handleChange} /><br />

                <label>Main:</label>
                <input type="text" name="main" value={formData.main} onChange={handleChange} /><br />

                <label>City:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} /><br />
                
                <label>Area:</label>
                <input type="text" name="area" value={formData.area} onChange={handleChange} /><br />
                
                <label>Zip Code:</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleChange} /><br />

                <label>Mobile no.:</label>
                <input type="text" name="phno" value={formData.phno} onChange={handleChange} /><br />

                <label>Landmark:</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} /><br />
                
                <label>Connection Type:</label>
                <input type="text" name="typeofactivity" value={formData.typeofactivity} onChange={handleChange} /><br />
                
                <label>Load Requirement (in kW):</label>
                <input type="text" name="loadRequirement" value={formData.loadRequirement} onChange={handleChange} /><br />
                
                <label>RR Number:</label>
                <input type="text" name="meterNumber" value={formData.meterNumber} onChange={handleChange} /><br />
          
                <label>Name of the Licensed Electrical Contractor :</label>
                <input type="text" name="lecname" value={formData.lecname} onChange={handleChange} /><br />

                <label>Address of the Licensed Electrical Contractor:</label>
                <input type="text" name="lecaddress" value={formData.lecaddress} onChange={handleChange} /><br />

                <label>Date of declaration:</label>
                <input type="text" name="dateofdeclaration" value={formData.dateofdeclaration} onChange={handleChange} /><br />

                <label>Place of declaration:</label>
                <input type="text" name="placeofdeclaration" value={formData.placeofdeclaration} onChange={handleChange} /><br />
                
                <div className='application-form-buttons'>
                    <button type="button" onClick={saveForm}>Save</button>
                    <button type="button" onClick={generatePDF}>Generate PDF</button>
                </div>
            </form>
        </div>
    );
};




export default ElectricityConnectionForm;
