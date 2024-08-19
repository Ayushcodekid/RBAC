import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./components/Home";
import "./components/Login"
import App from "./App";
import DocumentPage from "./components/Document_page/document";

import Login from "./components/Login";

import Approvals from "./components/Approvals/approvals";
import Municipal from "./components/Approvals/municipal";
import ServiceProviders from "./components/Approvals/serviceproviders";

import Architecture from "./components/Architecture/Architecture"
import Quotation from "./components/Architecture/Quotation_page";
import GoogleForm from "./components/Architecture/GoogleForm";

import Subcription from "./components/marketplace/subscription"
import Basicplan from "./components/marketplace/basicplan";
import Plandetails from "./components/marketplace/plandetails";
import Standardplan from "./components/marketplace/Standard";
import Premiumplan from "./components/marketplace/premium";
import PaymentForm from "./components/marketplace/payment";
import Tax from './components/Tax/Tax';
import { ProjectProvider } from "./components/BldgServiceContext";

import BorewellForm from "./components/Applications/Borewell";
import IndemnityBondForm from "./components/Applications/Indemnity Bond";
import BondOfAssuranceForm from "./components/Applications/Bond of Assurance";
import AffidavitForm from "./components/Applications/Affidavit";
import ElectricityConnectionForm from "./components/Applications/Electricity connection";

function App1() {
    return (
        <>
            <ProjectProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="document" element={<DocumentPage />} />

                    <Route path="approvals" element={<Approvals />} />
                    <Route path="approvals/municipal" element={<Municipal />} />
                    <Route path="approvals/municipal/serviceproviders" element={<ServiceProviders />} />

                    <Route path="architecture" element={<Architecture />} />
                    <Route path="architecture/quotation" element={<Quotation />} />
                    <Route path="architecture/quotation/googleForm" element={<GoogleForm />} />

                    <Route path="/plandetails" element={<Plandetails />} />
                    <Route path="/plandetails/payment" element={<PaymentForm />} />
                    <Route path="/Standard" element={<Standardplan />} />
                    <Route path="/Standard/payment" element={<PaymentForm />} />
                    <Route path="/premium" element={<Premiumplan />} />
                    <Route path="/premium/payment" element={<PaymentForm />} />

                    <Route path="subcription" element={<Subcription />} />
                    <Route path="subcription/basicplan" element={<Basicplan />} />
                    <Route path="subcription/basicplan/Login" element={<Login />} />
                    <Route path="subcription/basicplan/Login/payment" element={<PaymentForm />} />
                    <Route path="subcription/basicplan/plandetails" element={<Plandetails />} />
                    <Route path="subcription/basicplan/Standard" element={<Standardplan />} />
                    <Route path="subcription/basicplan/premium" element={<Premiumplan />} />
                    <Route path="subcription/basicplan/plandetails/payment" element={<PaymentForm />} />
                    <Route path="subcription/basicplan/Standard/payment" element={<PaymentForm />} />
                    <Route path="subcription/basicplan/premium/payment" element={<PaymentForm />} />

                    <Route path="tax" element={<Tax />} />

                    <Route path='document/borewell' element={<BorewellForm/>}/>
                    <Route path='document/indemnitybond' element={<IndemnityBondForm/>}/>
                    <Route path='document/bondofassurance' element={<BondOfAssuranceForm/>}/>
                    <Route path='document/affidavit' element={<AffidavitForm/>}/>
                    <Route path='document/electricityconnection' element={<ElectricityConnectionForm/>}/>
                </Routes>
            </ProjectProvider>
        </>
    );
}

export default App1;

