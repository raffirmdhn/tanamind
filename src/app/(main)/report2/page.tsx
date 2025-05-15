import React from 'react'

const page = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', fontFamily: 'Nunito' }}>
      <h2 style={{ marginBottom: 24, fontWeight: 500, fontFamily: 'Nunito' }}>AI Analysis Result</h2>
      <div style={{ background: '#F6FCF8', border: '1.5px solid #B6E2C6', borderRadius: 32, width: 340, display: 'flex', alignItems: 'center', padding: 20, marginBottom: 24, fontFamily: 'Nunito' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #B6E2C6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 600, color: '#4CB782', marginRight: 18, fontFamily: 'Nunito' }}>A</div>
        <div style={{ fontFamily: 'Nunito' }}>
          <div style={{ fontSize: 15, color: '#7A7A7A', fontFamily: 'Nunito' }}>Your Plant Condition's</div>
          <div style={{ fontSize: 20, color: '#4CB782', fontWeight: 600, fontFamily: 'Nunito' }}>Excellent</div>
        </div>
      </div>
      {/* Additional Notes */}
      <div style={{ width: 340, background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px #0001', marginBottom: 18, fontFamily: 'Nunito' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'Nunito' }}>
          <span style={{ fontWeight: 500, fontFamily: 'Nunito' }}>Additional Notes</span>
          <span style={{ fontSize: 22, color: '#7A7A7A', fontFamily: 'Nunito' }}>▼</span>
        </div>
        <div style={{ padding: '14px 20px', fontSize: 14, color: '#444', fontFamily: 'Nunito' }}>
          <b>Plant Height:</b><br />
          The plant height matches the user's input of 61.4 cm, which aligns with the average height of mustard greens in the first week based on the dataset. This indicates the plant is in its early growth stage.<br /><br />
          <b>Leaf Condition:</b><br />
          There are several black spots on the leaves. This could be caused by a fungal infection or pest attack.<br /><br />
          <b>Soil Condition:</b><br />
          The soil appears moist; however, there are some foreign materials present, such as stones.
        </div>
      </div>
      {/* Recommended Actions */}
      <div style={{ width: 340, background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px #0001', marginBottom: 32, fontFamily: 'Nunito' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'Nunito' }}>
          <span style={{ fontWeight: 500, fontFamily: 'Nunito' }}>Recommended Actions</span>
          <span style={{ fontSize: 22, color: '#7A7A7A', fontFamily: 'Nunito' }}>▼</span>
        </div>
        <div style={{ padding: '14px 20px', fontSize: 14, color: '#444', fontFamily: 'Nunito' }}>
          <b>Monitor Black Spots:</b><br />
          Regularly observe the development of black spots on the leaves. If they spread rapidly, consider using an appropriate organic fungicide or insecticide.<br /><br />
          <b>Soil Cleanliness:</b><br />
          Remove foreign materials (stones and debris) from around the plant to prevent root growth obstruction and reduce the risk of disease.<br /><br />
          <b>Watering:</b><br />
          Monitor soil moisture levels. Avoid overwatering, as it can trigger fungal growth.<br /><br />
          <b>Fertilization:</b><br />
          Since the plant is still in its early growth stage (week one), provide fertilizer with sufficient nitrogen content to support leaf development. Fertilization should be done with the correct dosage.
        </div>
      </div>
      <button style={{ width: 340, background: '#4CB782', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 0', fontSize: 18, fontWeight: 600, boxShadow: '0 2px 8px #0001', cursor: 'pointer', fontFamily: 'Nunito' }}>
        Save & Continue
      </button>
    </div>
  )
}

export default page
