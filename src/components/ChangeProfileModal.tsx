// ...existing code...
function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  console.log('handleFile called, file:', file)
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    console.log('file read, setting preview')
    setPreview(String(reader.result))
  }
  reader.readAsDataURL(file)
}

async function handleConfirm() {
  if (!preview) {
    console.log('Confirm blocked: no preview')
    return
  }
  try {
    setLoading(true)
    console.log('Uploading: preview length', preview.length)
    const body = JSON.stringify({ data: preview, name: `profile-${Date.now()}.png` })
    const res = await fetch('/api/profile/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    const json = await res.json()
    console.log('upload response', res.status, json)
    if (res.ok && json?.url) {
      const urlWithTs = `${json.url}${json.url.includes('?') ? '&' : '?'}t=${Date.now()}`
      onUpdated(urlWithTs)
      setOk(true)
      setTimeout(() => {
        setOk(false)
        onClose()
      }, 1200)
    } else {
      alert('Upload failed: ' + (json?.error ?? res.status))
    }
  } catch (err) {
    console.error('Upload error', err)
    alert('Upload error')
  } finally {
    setLoading(false)
  }
}
// ...existing code...