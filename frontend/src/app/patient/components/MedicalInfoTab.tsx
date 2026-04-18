// frontend/src/app/patient/components/MedicalInfoTab.tsx


// this crud patient data but not display , it export.

import { useEffect, useState } from "react";
import { Patient } from "../../../types";
import { getDependencies, createDependency, updateDependency, deleteDependency } from "../../../api/medical";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Plus, Trash2, Pencil, Check, X, Loader2, AlertCircle } from "lucide-react";

const ItemStatus = ({ status }: { status: string }) => {
  if (status === "approved") {
    return <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider">Approved</span>;
  }
  return <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-bold uppercase tracking-wider">Pending</span>;
};

const AllergyItem = ({ item, onUpdate, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ allergy_name: item.allergy_name, severity: item.severity });

  const handleSave = () => {
    onUpdate('allergies', item.allergy_id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex justify-between items-center p-2 bg-white rounded-lg border border-blue-200 shadow-sm">
         <div className="flex gap-2 flex-1 mr-2">
            <input value={formData.allergy_name} onChange={e => setFormData({...formData, allergy_name: e.target.value})} className="flex-1 rounded border-slate-300 px-2 py-1 text-sm" />
            <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="rounded border-slate-300 px-2 py-1 text-sm">
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
         </div>
         <div className="flex gap-1">
           <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="h-4 w-4"/></button>
           <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:bg-slate-50 p-1 rounded"><X className="h-4 w-4"/></button>
         </div>
      </li>
    );
  }

  return (
    <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
      <div>
        <span className="font-medium text-slate-800">{item.allergy_name}</span>
        <span className="ml-2 text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{item.severity}</span>
        <ItemStatus status={item.approval_status} />
      </div>
      <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600 p-1"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onDelete('allergies', item.allergy_id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
      </div>
    </li>
  );
};

const ConditionItem = ({ item, onUpdate, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ condition_name: item.condition_name, critical_flag: item.critical_flag });

  const handleSave = () => {
    onUpdate('conditions', item.condition_id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex justify-between items-center p-2 bg-white rounded-lg border border-blue-200 shadow-sm">
         <div className="flex gap-2 flex-1 mr-2 items-center">
            <input value={formData.condition_name} onChange={e => setFormData({...formData, condition_name: e.target.value})} className="flex-1 rounded border-slate-300 px-2 py-1 text-sm" />
            <label className="flex items-center gap-1 text-xs text-red-600"><input type="checkbox" checked={formData.critical_flag} onChange={e => setFormData({...formData, critical_flag: e.target.checked})} className="rounded border-red-300"/> Critical</label>
         </div>
         <div className="flex gap-1">
           <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="h-4 w-4"/></button>
           <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:bg-slate-50 p-1 rounded"><X className="h-4 w-4"/></button>
         </div>
      </li>
    );
  }

  return (
    <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
      <div>
        <span className="font-medium text-slate-800">{item.condition_name}</span>
        {item.critical_flag && <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Critical</span>}
        <ItemStatus status={item.approval_status} />
      </div>
      <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600 p-1"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onDelete('conditions', item.condition_id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
      </div>
    </li>
  );
};

const MedicationItem = ({ item, onUpdate, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ medication_name: item.medication_name, dosage: item.dosage });

  const handleSave = () => {
    onUpdate('medications', item.medication_id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-blue-200 shadow-sm">
         <input value={formData.medication_name} onChange={e => setFormData({...formData, medication_name: e.target.value})} className="w-full rounded border-slate-300 px-2 py-1 text-sm font-semibold" />
         <input value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} className="w-full rounded border-slate-300 px-2 py-1 text-sm" />
         <div className="flex justify-end gap-1 mt-1">
           <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1 rounded flex items-center text-xs"><Check className="h-3 w-3 mr-1"/> Save</button>
           <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:bg-slate-50 p-1 rounded flex items-center text-xs"><X className="h-3 w-3 mr-1"/> Cancel</button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm group">
      <div>
        <h4 className="font-semibold text-slate-800 flex items-center">
           {item.medication_name}
           <ItemStatus status={item.approval_status} />
        </h4>
        <p className="text-sm text-slate-500 mt-1">{item.dosage}</p>
      </div>
      <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onDelete('medications', item.medication_id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full"><Trash2 className="h-4 w-4" /></button>
      </div>
   </div>
  );
};

const DeviceItem = ({ item, onUpdate, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ device_name: item.device_name, device_type: item.device_type });

  const handleSave = () => {
    onUpdate('devices', item.device_id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex justify-between items-center p-2 bg-white rounded-lg border border-indigo-200 shadow-sm">
         <div className="flex gap-2 flex-1 mr-2">
            <input value={formData.device_name} onChange={e => setFormData({...formData, device_name: e.target.value})} className="flex-1 rounded border-slate-300 px-2 py-1 text-sm" />
            <input value={formData.device_type} onChange={e => setFormData({...formData, device_type: e.target.value})} className="flex-1 rounded border-slate-300 px-2 py-1 text-sm" />
         </div>
         <div className="flex gap-1">
           <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="h-4 w-4"/></button>
           <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:bg-slate-50 p-1 rounded"><X className="h-4 w-4"/></button>
         </div>
      </li>
    );
  }

  return (
    <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
      <div>
        <span className="font-medium text-slate-800">{item.device_name}</span>
        <span className="ml-2 text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{item.device_type}</span>
        <ItemStatus status={item.approval_status} />
      </div>
      <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600 p-1"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onDelete('devices', item.device_id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
      </div>
    </li>
  );
};

const ContactItem = ({ item, onUpdate, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ contact_name: item.contact_name, contact_relationship: item.contact_relationship, phone_number: item.phone_number });

  const handleSave = () => {
    onUpdate('emergency-contacts', item.contact_id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-teal-200 shadow-sm">
         <input value={formData.contact_name} onChange={e => setFormData({...formData, contact_name: e.target.value})} className="w-full rounded border-slate-300 px-2 py-1 text-sm font-semibold" />
         <div className="flex gap-2">
            <input value={formData.contact_relationship} onChange={e => setFormData({...formData, contact_relationship: e.target.value})} className="flex-1 rounded border-slate-300 px-2 py-1 text-sm" />
            <input value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 rounded border-slate-300 px-2 py-1 text-sm" />
         </div>
         <div className="flex justify-end gap-1 mt-1">
           <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1 rounded flex items-center text-xs"><Check className="h-3 w-3 mr-1"/> Save</button>
           <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:bg-slate-50 p-1 rounded flex items-center text-xs"><X className="h-3 w-3 mr-1"/> Cancel</button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm group">
      <div>
        <h4 className="font-semibold text-slate-800 flex items-center">
           {item.contact_name}
           <span className="ml-2 text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">{item.contact_relationship}</span>
           <ItemStatus status={item.approval_status} />
        </h4>
        <p className="text-sm text-slate-500 mt-1 font-mono">{item.phone_number}</p>
      </div>
      <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onDelete('emergency-contacts', item.contact_id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
};



export default function MedicalInfoTab({ patient }: { patient: Patient | null }) {
  const [data, setData] = useState({
    allergies: [],
    conditions: [],
    medications: [],
    devices: [],
    "emergency-contacts": []
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const [allergies, conditions, medications, devices, emergencyContacts] = await Promise.all([
        getDependencies("allergies", patient.patient_id),
        getDependencies("conditions", patient.patient_id),
        getDependencies("medications", patient.patient_id),
        getDependencies("devices", patient.patient_id),
        getDependencies("emergency-contacts", patient.patient_id)
      ]);
      setData({ allergies, conditions, medications, devices, "emergency-contacts": emergencyContacts });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patient]);

  const handleDelete = async (endpoint: any, id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDependency(endpoint, id);
        loadData();
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
  };

  const handleUpdate = async (endpoint: any, id: number, payload: any) => {
    try {
      await updateDependency(endpoint, id, payload);
      loadData();
    } catch (err) {
      alert("Failed to update record.");
    }
  };

  const handleAddAllergy = async (e: any) => {
    e.preventDefault();
    await createDependency("allergies", {
      allergy_name: e.target.allergy_name.value,
      severity: e.target.severity.value,
      patient_id: patient?.patient_id
    });
    e.target.reset();
    loadData();
  };

  const handleAddCondition = async (e: any) => {
    e.preventDefault();
    await createDependency("conditions", {
      condition_name: e.target.condition_name.value,
      critical_flag: e.target.critical_flag.checked,
      patient_id: patient?.patient_id
    });
    e.target.reset();
    loadData();
  };

  const handleAddMedication = async (e: any) => {
    e.preventDefault();
    await createDependency("medications", {
      medication_name: e.target.medication_name.value,
      dosage: e.target.dosage.value,
      patient_id: patient?.patient_id
    });
    e.target.reset();
    loadData();
  };

  const handleAddDevice = async (e: any) => {
    e.preventDefault();
    await createDependency("devices", {
      device_name: e.target.device_name.value,
      device_type: e.target.device_type.value,
      patient_id: patient?.patient_id
    });
    e.target.reset();
    loadData();
  };

  const handleAddContact = async (e: any) => {
    e.preventDefault();
    await createDependency("emergency-contacts", {
      contact_name: e.target.contact_name.value,
      contact_relationship: e.target.contact_relationship.value,
      phone_number: e.target.phone_number.value,
      patient_id: patient?.patient_id
    });
    e.target.reset();
    loadData();
  };


  if (loading) {
    return <div className="flex justify-center p-12 text-slate-400"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ALLERGIES */}
        <Card>
          <CardHeader className="bg-orange-50 border-b border-orange-100 pb-4">
            <CardTitle className="text-orange-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Allergies</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.allergies.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No allergies recorded.</p> : (
              <ul className="space-y-2">
                {data.allergies.map((item: any) => (
                   <AllergyItem key={item.allergy_id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </ul>
            )}
            <form onSubmit={handleAddAllergy} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Allergy</h4>
              <div className="flex gap-2">
                <input required name="allergy_name" placeholder="Allergy Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <select name="severity" className="rounded-md border-slate-300 px-3 py-1.5 text-sm">
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
                <button type="submit"  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2">Add</button>

              </div>
            </form>
          </CardContent>
        </Card>

        {/* CONDITIONS */}
        <Card>
          <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
            <CardTitle className="text-red-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Chronic Conditions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.conditions.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No conditions recorded.</p> : (
              <ul className="space-y-2">
                {data.conditions.map((item: any) => (
                   <ConditionItem key={item.condition_id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </ul>
            )}
            <form onSubmit={handleAddCondition} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Condition</h4>
              <div className="flex gap-2 items-center">
                <input required name="condition_name" placeholder="Condition Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <label className="flex items-center gap-1 text-sm text-red-700 font-medium">
                  <input type="checkbox" name="critical_flag" className="rounded border-red-300 text-red-600" />
                  Critical
                </label>
            <button type="submit"  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2">Add</button>

                
              </div>
            </form>
          </CardContent>
        </Card>

        {/* MEDICATIONS */}
        <Card className="lg:col-span-2">
          <CardHeader className="bg-blue-50 border-b border-blue-100 flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-blue-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Active Medications</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.medications.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No active medications.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.medications.map((item: any) => (
                   <MedicationItem key={item.medication_id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </div>
            )}
            <form onSubmit={handleAddMedication} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Medication</h4>
              <div className="flex flex-col md:flex-row gap-2">
                <input required name="medication_name" placeholder="Medication Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <input required name="dosage" placeholder="Dosage Details" className="flex-[2] rounded-md border-slate-300 px-3 py-1.5 text-sm" />
            <button type="submit"  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2">Add</button>

                
              </div>
            </form>
          </CardContent>
        </Card>

        {/* DEVICES */}
        <Card>
          <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-4">
            <CardTitle className="text-indigo-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Medical Devices</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.devices.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No medical devices recorded.</p> : (
              <ul className="space-y-2">
                {data.devices.map((item: any) => (
                   <DeviceItem key={item.device_id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </ul>
            )}
            <form onSubmit={handleAddDevice} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Device</h4>
              <div className="flex gap-2">
                <input required name="device_name" placeholder="Device Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <input required name="device_type" placeholder="Device Type" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
            <button type="submit"  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2">Add</button>

              </div>
            </form>
          </CardContent>
        </Card>

        {/* EMERGENCY CONTACTS */}
        <Card>
          <CardHeader className="bg-teal-50 border-b border-teal-100 flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-teal-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data["emergency-contacts"].length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No emergency contacts recorded.</p> : (
              <div className="grid grid-cols-1 gap-4">
                {data["emergency-contacts"].map((item: any) => (
                   <ContactItem key={item.contact_id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </div>
            )}
            <form onSubmit={handleAddContact} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Contact</h4>
              <div className="flex flex-col gap-2">
                <input required name="contact_name" placeholder="Contact Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <div className="flex gap-2">
                  <input required name="contact_relationship" placeholder="Relationship" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                  <input required name="phone_number" placeholder="Phone Number" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />


            <button type="submit" 
            
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
            
            >Add</button>



                </div>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
