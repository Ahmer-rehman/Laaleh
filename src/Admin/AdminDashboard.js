import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Style/AdminDashboard.css';
import app from "./Firebase/Firebase"

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [Catagory, setCatagory] = useState("");
    const db = getFirestore(app);
    const storage = getStorage(app);

    useEffect(() => {
        const fetchProducts = async () => {
            const productCollection = collection(db, 'products');
            const snapshot = await getDocs(productCollection);
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        };

        fetchProducts();
    }, [db]);

    const handleAddProduct = async () => {
        const uploadedImageURLs = [];
        for (let i = 0; i < imageFiles.length; i++) {
            const storageRef = ref(storage, `images/${productName}-${Date.now()}-${i}`);
            try {
                await uploadBytes(storageRef, imageFiles[i]);
                const imageUrl = await getDownloadURL(storageRef);
                uploadedImageURLs.push(imageUrl);
            } catch (error) {
                console.error('Error uploading image: ', error);
            }
        }

        const newProduct = {
            name: productName,
            price: productPrice,
            catagory: Catagory,
            description: productDescription,
            images: uploadedImageURLs
        };

        try {
            const docRef = await addDoc(collection(db, 'products'), newProduct);
            setProducts([...products, { id: docRef.id, ...newProduct }]);
            setProductName('');
            setProductPrice('');
            setProductDescription('');
            setImageFiles([]);
            setImagePreviews([]);
            setCatagory("");
        } catch (error) {
            console.error('Error adding product: ', error);
        }
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        const previews = [];
        for (let i = 0; i < files.length; i++) {
            previews.push(URL.createObjectURL(files[i]));
        }
        setImageFiles([...imageFiles, ...files]);
        setImagePreviews([...imagePreviews, ...previews]);
    };

    const handleDeletePreview = (index) => {
        const newImageFiles = [...imageFiles];
        const newImagePreviews = [...imagePreviews];
        newImageFiles.splice(index, 1);
        newImagePreviews.splice(index, 1);
        setImageFiles(newImageFiles);
        setImagePreviews(newImagePreviews);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            const updatedProducts = products.filter(product => product.id !== id);
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error deleting product: ', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>
            <div className="product-management">
                <h2 style={{ textAlign: "center" }}>Product Management</h2>

                <div className="add-product-form">
                    <input type="text" placeholder="Product Name" value={productName} onChange={e => setProductName(e.target.value)} />
                    <input type="text" placeholder="Product Price" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
                    <input type="text" placeholder="Category e.g shop sale New " value={Catagory} onChange={e => setCatagory(e.target.value)} />
                    <textarea placeholder="Product Description" value={productDescription} onChange={e => setProductDescription(e.target.value)} />
                    <input type="file" onChange={handleFileUpload} multiple />
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview">
                            <img src={preview} alt="Preview" />
                            <button onClick={() => handleDeletePreview(index)}>Delete</button>
                        </div>
                    ))}
                    <button onClick={handleAddProduct} style={{ display: "block", margin: "0 auto", backgroundColor: "black" }}>Add Product</button>
                </div>

                <div className="product-list">
                    {products.map((product, index) => (
                        <div key={product.id} className="product-card">
                            {product.images && product.images.map((image, index) => (
                                <img key={index} src={image} alt={`Product ${index + 1}`} className="product-image" />
                            ))}
                            <div className="product-details">
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>{product.name}</h3>
                                <p style={{ fontSize: '1rem', color: '#555', marginBottom: '5px', wordWrap: 'break-word' }}>{product.description}</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27ae60' }}>PKR {product.price}</p>
                            </div>
                            <div className="product-actions">
                                <button onClick={() => handleDeleteProduct(product.id)}>Delete Product</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
