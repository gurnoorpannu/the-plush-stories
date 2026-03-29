'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Product, Category, SiteSettings } from '@/lib/types';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getSiteSettings,
  updateSiteSettings,
  uploadImage,
} from '@/lib/firebaseUtils';

/* ───────────────────────── colour tokens ───────────────────────── */
const C = {
  bg: '#FAF7F2',
  primary: '#C4916E',
  secondary: '#8B7355',
  accent: '#E8B4A0',
  dark: '#2D2D2D',
  subtle: '#F0EBE3',
} as const;

type Tab = 'products' | 'categories' | 'settings' | 'quicklinks';

/* ================================================================
   ADMIN PAGE
   ================================================================ */
export default function AdminPage() {
  /* ── auth state ── */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  /* ── tab state ── */
  const [activeTab, setActiveTab] = useState<Tab>('products');

  /* ── data state ── */
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── product form state ── */
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm());
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [savingProduct, setSavingProduct] = useState(false);

  /* ── category form state ── */
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm());
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  /* ── settings form state ── */
  const [settingsForm, setSettingsForm] = useState(emptySettingsForm());
  const [savingSettings, setSavingSettings] = useState(false);

  /* ── delete confirmation ── */
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'category';
    id: string;
    name: string;
  } | null>(null);

  /* ── mobile sidebar ── */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ────────────────── helpers ────────────────── */
  function emptyProductForm() {
    return {
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: '',
      amazonLink: '',
      flipkartLink: '',
      meeshoLink: '',
      otherLink: '',
      isBestseller: false,
      isNewArrival: false,
      isFeatured: false,
    };
  }

  function emptyCategoryForm() {
    return { name: '', slug: '', order: 0 };
  }

  function emptySettingsForm(): SiteSettings {
    return {
      heroTitle: '',
      heroSubtitle: '',
      announcementBar: '',
      showAnnouncementBar: false,
      contactPhone: '',
      contactEmail: '',
      instagramLink: '',
      whatsappNumber: '',
    };
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
  }

  /* ────────────────── data fetching ────────────────── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        getProducts(),
        getCategories(),
        getSiteSettings(),
      ]);
      setProducts(p);
      setCategories(c);
      setSettings(s);
      if (s) setSettingsForm(s);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data from Firebase');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchAll();
  }, [isLoggedIn, fetchAll]);

  /* ────────────────── login handler ────────────────── */
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === 'yug' && password === 'sakshi') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  }

  /* ────────────────── product handlers ────────────────── */
  function openAddProduct() {
    setEditingProduct(null);
    setProductForm(emptyProductForm());
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setShowProductForm(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice ?? 0,
      category: p.category,
      amazonLink: p.amazonLink ?? '',
      flipkartLink: p.flipkartLink ?? '',
      meeshoLink: p.meeshoLink ?? '',
      otherLink: p.otherLink ?? '',
      isBestseller: p.isBestseller,
      isNewArrival: p.isNewArrival,
      isFeatured: p.isFeatured,
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages(p.images ?? []);
    setShowProductForm(true);
  }

  function handleProductImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function removeNewImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!productForm.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (productForm.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setSavingProduct(true);
    try {
      /* upload new images */
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const path = `products/${Date.now()}_${file.name}`;
        const url = await uploadImage(file, path);
        uploadedUrls.push(url);
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const data: any = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        category: productForm.category,
        images: allImages,
        isBestseller: productForm.isBestseller,
        isNewArrival: productForm.isNewArrival,
        isFeatured: productForm.isFeatured,
        createdAt: editingProduct ? editingProduct.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      // Only add optional fields if they have values (Firebase doesn't accept undefined)
      if (productForm.originalPrice && Number(productForm.originalPrice) > 0) {
        data.originalPrice = Number(productForm.originalPrice);
      }
      if (productForm.amazonLink.trim()) {
        data.amazonLink = productForm.amazonLink.trim();
      }
      if (productForm.flipkartLink.trim()) {
        data.flipkartLink = productForm.flipkartLink.trim();
      }
      if (productForm.meeshoLink.trim()) {
        data.meeshoLink = productForm.meeshoLink.trim();
      }
      if (productForm.otherLink.trim()) {
        data.otherLink = productForm.otherLink.trim();
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success('Product updated successfully');
      } else {
        await addProduct(data);
        toast.success('Product added successfully');
      }

      setShowProductForm(false);
      await fetchAll();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  }

  async function confirmDeleteProduct(id: string) {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    }
  }

  /* ────────────────── category handlers ────────────────── */
  function openAddCategory() {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm());
    setCategoryImageFile(null);
    setCategoryImagePreview('');
    setShowCategoryForm(true);
  }

  function openEditCategory(c: Category) {
    setEditingCategory(c);
    setCategoryForm({ name: c.name, slug: c.slug, order: c.order });
    setCategoryImageFile(null);
    setCategoryImagePreview(c.image ?? '');
    setShowCategoryForm(true);
  }

  function handleCategoryImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCategoryImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCategoryImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSavingCategory(true);
    try {
      let imageUrl = editingCategory?.image;
      if (categoryImageFile) {
        const path = `categories/${Date.now()}_${categoryImageFile.name}`;
        imageUrl = await uploadImage(categoryImageFile, path);
      }

      const data: any = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug || slugify(categoryForm.name),
        order: Number(categoryForm.order),
      };

      // Only add image if it exists (Firebase doesn't accept undefined)
      if (imageUrl) {
        data.image = imageUrl;
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success('Category updated');
      } else {
        await addCategory(data);
        toast.success('Category added');
      }

      setShowCategoryForm(false);
      await fetchAll();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save category');
    } finally {
      setSavingCategory(false);
    }
  }

  async function confirmDeleteCategory(id: string) {
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    }
  }

  /* ────────────────── settings handler ────────────────── */
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSiteSettings(settingsForm);
      toast.success('Settings saved');
      await fetchAll();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  }

  /* ================================================================
     RENDER: LOGIN SCREEN
     ================================================================ */
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: C.bg }}
      >
        <div
          className="w-full max-w-md rounded-2xl shadow-xl p-8"
          style={{ background: '#fff' }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: C.dark }}
            >
              The Plush Stories&trade;
            </h1>
            <p className="text-sm" style={{ color: C.secondary }}>
              Admin Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: C.dark }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow focus:ring-2"
                style={{
                  borderColor: C.subtle,
                  background: C.bg,
                  color: C.dark,
                  // @ts-expect-error css custom property
                  '--tw-ring-color': C.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: C.dark }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow focus:ring-2"
                style={{
                  borderColor: C.subtle,
                  background: C.bg,
                  color: C.dark,
                  // @ts-expect-error css custom property
                  '--tw-ring-color': C.primary,
                }}
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-600 text-center">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: C.primary }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ================================================================
     RENDER: DASHBOARD
     ================================================================ */

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'products', label: 'Products', icon: '📦' },
    { key: 'categories', label: 'Categories', icon: '🏷️' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
    { key: 'quicklinks', label: 'Quick Links', icon: '🔗' },
  ];

  /* ── shared UI helpers ── */
  const Btn = ({
    children,
    onClick,
    variant = 'primary',
    disabled,
    type = 'button',
    className = '',
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    disabled?: boolean;
    type?: 'button' | 'submit';
    className?: string;
  }) => {
    const base = 'px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 ';
    const styles: Record<string, string> = {
      primary: `text-white`,
      secondary: `border`,
      danger: `text-white bg-red-500 hover:bg-red-600`,
      ghost: `hover:opacity-80`,
    };
    const inlineStyles: Record<string, React.CSSProperties> = {
      primary: { background: C.primary },
      secondary: { borderColor: C.secondary, color: C.secondary },
      danger: {},
      ghost: { color: C.secondary },
    };
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${styles[variant]} ${className}`}
        style={inlineStyles[variant]}
      >
        {children}
      </button>
    );
  };

  const Input = ({
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    required,
    rows,
  }: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: C.dark }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="w-full px-3 py-2 rounded-lg border outline-none text-sm focus:ring-2"
          style={{ borderColor: C.subtle, background: C.bg, color: C.dark }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 rounded-lg border outline-none text-sm focus:ring-2"
          style={{ borderColor: C.subtle, background: C.bg, color: C.dark }}
        />
      )}
    </div>
  );

  const Checkbox = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: C.dark }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded"
        style={{ accentColor: C.primary }}
      />
      {label}
    </label>
  );

  /* ── delete confirmation modal ── */
  const DeleteModal = () => {
    if (!deleteTarget) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
          <h3 className="text-lg font-semibold mb-2" style={{ color: C.dark }}>
            Delete {deleteTarget.type === 'product' ? 'Product' : 'Category'}?
          </h3>
          <p className="text-sm mb-6" style={{ color: C.secondary }}>
            Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Btn variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              onClick={() =>
                deleteTarget.type === 'product'
                  ? confirmDeleteProduct(deleteTarget.id)
                  : confirmDeleteCategory(deleteTarget.id)
              }
            >
              Delete
            </Btn>
          </div>
        </div>
      </div>
    );
  };

  /* ================================================================
     TAB: PRODUCTS
     ================================================================ */
  const ProductsTab = () => {
    if (showProductForm) {
      return (
        <form onSubmit={handleSaveProduct} className="space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold" style={{ color: C.dark }}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <Btn variant="ghost" onClick={() => setShowProductForm(false)}>
              Cancel
            </Btn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={productForm.name}
              onChange={(v) => setProductForm((f) => ({ ...f, name: v }))}
              placeholder="e.g. Fluffy Teddy Bear"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: C.dark }}>
                Category
              </label>
              <select
                value={productForm.category}
                onChange={(e) =>
                  setProductForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                style={{ borderColor: C.subtle, background: C.bg, color: C.dark }}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Price"
              type="number"
              value={productForm.price}
              onChange={(v) => setProductForm((f) => ({ ...f, price: Number(v) }))}
              placeholder="499"
              required
            />
            <Input
              label="Original Price / MRP (optional)"
              type="number"
              value={productForm.originalPrice || ''}
              onChange={(v) =>
                setProductForm((f) => ({ ...f, originalPrice: Number(v) }))
              }
              placeholder="999"
            />
          </div>

          <Input
            label="Description"
            value={productForm.description}
            onChange={(v) => setProductForm((f) => ({ ...f, description: v }))}
            placeholder="Write a short description..."
            rows={4}
          />

          {/* images */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.dark }}>
              Product Images
            </label>

            {/* existing images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border" style={{ borderColor: C.subtle }}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* new image previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border" style={{ borderColor: C.accent }}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      x
                    </button>
                    <span
                      className="absolute bottom-0 left-0 right-0 text-[10px] text-center py-0.5 text-white"
                      style={{ background: C.primary }}
                    >
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}

            <label
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors hover:opacity-80"
              style={{ borderColor: C.primary, color: C.primary }}
            >
              + Add Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleProductImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* marketplace links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amazon Link"
              value={productForm.amazonLink}
              onChange={(v) => setProductForm((f) => ({ ...f, amazonLink: v }))}
              placeholder="https://amazon.in/..."
            />
            <Input
              label="Flipkart Link"
              value={productForm.flipkartLink}
              onChange={(v) => setProductForm((f) => ({ ...f, flipkartLink: v }))}
              placeholder="https://flipkart.com/..."
            />
            <Input
              label="Meesho Link"
              value={productForm.meeshoLink}
              onChange={(v) => setProductForm((f) => ({ ...f, meeshoLink: v }))}
              placeholder="https://meesho.com/..."
            />
            <Input
              label="Other Marketplace Link"
              value={productForm.otherLink}
              onChange={(v) => setProductForm((f) => ({ ...f, otherLink: v }))}
              placeholder="https://..."
            />
          </div>

          {/* toggles */}
          <div className="flex flex-wrap gap-6">
            <Checkbox
              label="Bestseller"
              checked={productForm.isBestseller}
              onChange={(v) => setProductForm((f) => ({ ...f, isBestseller: v }))}
            />
            <Checkbox
              label="New Arrival"
              checked={productForm.isNewArrival}
              onChange={(v) => setProductForm((f) => ({ ...f, isNewArrival: v }))}
            />
            <Checkbox
              label="Featured"
              checked={productForm.isFeatured}
              onChange={(v) => setProductForm((f) => ({ ...f, isFeatured: v }))}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Btn type="submit" disabled={savingProduct}>
              {savingProduct ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
            </Btn>
            <Btn variant="secondary" onClick={() => setShowProductForm(false)}>
              Cancel
            </Btn>
          </div>
        </form>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: C.dark }}>
            Products ({products.length})
          </h2>
          <Btn onClick={openAddProduct}>+ Add Product</Btn>
        </div>

        {products.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl"
            style={{ background: C.subtle, color: C.secondary }}
          >
            <p className="text-lg mb-2">No products yet</p>
            <p className="text-sm">Click &quot;Add Product&quot; to create your first product.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-white shadow-sm border"
                style={{ borderColor: C.subtle }}
              >
                {/* thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ background: C.subtle }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: C.secondary }}>
                      No img
                    </div>
                  )}
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: C.dark }}>
                      {p.name}
                    </span>
                    {p.isBestseller && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full text-white" style={{ background: C.primary }}>
                        Bestseller
                      </span>
                    )}
                    {p.isNewArrival && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full text-white" style={{ background: '#6B9F6B' }}>
                        New
                      </span>
                    )}
                    {p.isFeatured && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full text-white" style={{ background: C.secondary }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: C.secondary }}>
                    {p.category || 'No category'} &middot; Rs {p.price}
                    {p.originalPrice ? (
                      <span className="line-through ml-1 opacity-60">Rs {p.originalPrice}</span>
                    ) : null}
                  </p>
                </div>

                {/* actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Btn variant="secondary" onClick={() => openEditProduct(p)} className="!px-3 !py-1.5 !text-xs">
                    Edit
                  </Btn>
                  <Btn
                    variant="danger"
                    onClick={() => setDeleteTarget({ type: 'product', id: p.id, name: p.name })}
                    className="!px-3 !py-1.5 !text-xs"
                  >
                    Delete
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ================================================================
     TAB: CATEGORIES
     ================================================================ */
  const CategoriesTab = () => {
    if (showCategoryForm) {
      return (
        <form onSubmit={handleSaveCategory} className="space-y-5 max-w-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold" style={{ color: C.dark }}>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <Btn variant="ghost" onClick={() => setShowCategoryForm(false)}>
              Cancel
            </Btn>
          </div>

          <Input
            label="Category Name"
            value={categoryForm.name}
            onChange={(v) =>
              setCategoryForm((f) => ({ ...f, name: v, slug: slugify(v) }))
            }
            placeholder="e.g. Stuffed Animals"
            required
          />
          <Input
            label="Slug (auto-generated)"
            value={categoryForm.slug}
            onChange={(v) => setCategoryForm((f) => ({ ...f, slug: v }))}
            placeholder="stuffed-animals"
          />
          <Input
            label="Display Order"
            type="number"
            value={categoryForm.order}
            onChange={(v) => setCategoryForm((f) => ({ ...f, order: Number(v) }))}
            placeholder="1"
          />

          {/* category image */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.dark }}>
              Category Image (optional)
            </label>
            {categoryImagePreview && (
              <div className="w-32 h-32 rounded-lg overflow-hidden border mb-3" style={{ borderColor: C.subtle }}>
                <img src={categoryImagePreview} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <label
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium"
              style={{ borderColor: C.primary, color: C.primary }}
            >
              {categoryImagePreview ? 'Change Image' : '+ Add Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleCategoryImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Btn type="submit" disabled={savingCategory}>
              {savingCategory
                ? 'Saving...'
                : editingCategory
                ? 'Update Category'
                : 'Add Category'}
            </Btn>
            <Btn variant="secondary" onClick={() => setShowCategoryForm(false)}>
              Cancel
            </Btn>
          </div>
        </form>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: C.dark }}>
            Categories ({categories.length})
          </h2>
          <Btn onClick={openAddCategory}>+ Add Category</Btn>
        </div>

        {categories.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl"
            style={{ background: C.subtle, color: C.secondary }}
          >
            <p className="text-lg mb-2">No categories yet</p>
            <p className="text-sm">
              Click &quot;Add Category&quot; to create your first category.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border"
                style={{ borderColor: C.subtle }}
              >
                {c.image && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: C.dark }}>
                    {c.name}
                  </p>
                  <p className="text-xs" style={{ color: C.secondary }}>
                    /{c.slug} &middot; Order: {c.order}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn
                    variant="secondary"
                    onClick={() => openEditCategory(c)}
                    className="!px-3 !py-1.5 !text-xs"
                  >
                    Edit
                  </Btn>
                  <Btn
                    variant="danger"
                    onClick={() =>
                      setDeleteTarget({ type: 'category', id: c.id, name: c.name })
                    }
                    className="!px-3 !py-1.5 !text-xs"
                  >
                    Delete
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ================================================================
     TAB: SITE SETTINGS
     ================================================================ */
  const SettingsTab = () => (
    <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl">
      <h2 className="text-xl font-bold mb-4" style={{ color: C.dark }}>
        Site Settings
      </h2>

      <Input
        label="Hero Title"
        value={settingsForm.heroTitle}
        onChange={(v) => setSettingsForm((f) => ({ ...f, heroTitle: v }))}
        placeholder="Welcome to The Plush Stories"
      />
      <Input
        label="Hero Subtitle"
        value={settingsForm.heroSubtitle}
        onChange={(v) => setSettingsForm((f) => ({ ...f, heroSubtitle: v }))}
        placeholder="Handcrafted plush toys for every story"
        rows={2}
      />

      <div className="border-t pt-5" style={{ borderColor: C.subtle }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.dark }}>
          Announcement Bar
        </h3>
        <Input
          label="Announcement Text"
          value={settingsForm.announcementBar ?? ''}
          onChange={(v) => setSettingsForm((f) => ({ ...f, announcementBar: v }))}
          placeholder="Free shipping on orders above Rs 999!"
        />
        <div className="mt-3">
          <Checkbox
            label="Show Announcement Bar"
            checked={settingsForm.showAnnouncementBar}
            onChange={(v) => setSettingsForm((f) => ({ ...f, showAnnouncementBar: v }))}
          />
        </div>
      </div>

      <div className="border-t pt-5" style={{ borderColor: C.subtle }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.dark }}>
          Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Contact Phone"
            value={settingsForm.contactPhone}
            onChange={(v) => setSettingsForm((f) => ({ ...f, contactPhone: v }))}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Contact Email"
            value={settingsForm.contactEmail ?? ''}
            onChange={(v) => setSettingsForm((f) => ({ ...f, contactEmail: v }))}
            placeholder="hello@theplushstories.com"
          />
          <Input
            label="WhatsApp Number"
            value={settingsForm.whatsappNumber}
            onChange={(v) => setSettingsForm((f) => ({ ...f, whatsappNumber: v }))}
            placeholder="919876543210"
          />
          <Input
            label="Instagram Link"
            value={settingsForm.instagramLink ?? ''}
            onChange={(v) => setSettingsForm((f) => ({ ...f, instagramLink: v }))}
            placeholder="https://instagram.com/theplushstories"
          />
        </div>
      </div>

      <div className="pt-2">
        <Btn type="submit" disabled={savingSettings}>
          {savingSettings ? 'Saving...' : 'Save Settings'}
        </Btn>
      </div>
    </form>
  );

  /* ================================================================
     TAB: QUICK LINKS
     ================================================================ */
  const QuickLinksTab = () => {
    const productsWithLinks = products.filter(
      (p) => p.amazonLink || p.flipkartLink || p.meeshoLink || p.otherLink
    );

    return (
      <div>
        <h2 className="text-xl font-bold mb-6" style={{ color: C.dark }}>
          Quick Links &amp; Dashboard
        </h2>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Products', value: products.length },
            { label: 'Categories', value: categories.length },
            {
              label: 'Bestsellers',
              value: products.filter((p) => p.isBestseller).length,
            },
            {
              label: 'Featured',
              value: products.filter((p) => p.isFeatured).length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 text-center"
              style={{ background: C.subtle }}
            >
              <p className="text-2xl font-bold" style={{ color: C.primary }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: C.secondary }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* marketplace links */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: C.dark }}>
          Marketplace Links
        </h3>

        {productsWithLinks.length === 0 ? (
          <p className="text-sm" style={{ color: C.secondary }}>
            No products have marketplace links yet.
          </p>
        ) : (
          <div className="space-y-4">
            {productsWithLinks.map((p) => (
              <div
                key={p.id}
                className="rounded-xl p-4 bg-white shadow-sm border"
                style={{ borderColor: C.subtle }}
              >
                <p className="font-semibold text-sm mb-2" style={{ color: C.dark }}>
                  {p.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.amazonLink && (
                    <a
                      href={p.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full text-white"
                      style={{ background: '#FF9900' }}
                    >
                      Amazon
                    </a>
                  )}
                  {p.flipkartLink && (
                    <a
                      href={p.flipkartLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full text-white"
                      style={{ background: '#2874F0' }}
                    >
                      Flipkart
                    </a>
                  )}
                  {p.meeshoLink && (
                    <a
                      href={p.meeshoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full text-white"
                      style={{ background: '#E91E63' }}
                    >
                      Meesho
                    </a>
                  )}
                  {p.otherLink && (
                    <a
                      href={p.otherLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full text-white"
                      style={{ background: C.secondary }}
                    >
                      Other
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ================================================================
     MAIN LAYOUT
     ================================================================ */
  return (
    <div className="min-h-screen flex" style={{ background: C.bg }}>
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 flex-shrink-0 bg-white shadow-lg flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b" style={{ borderColor: C.subtle }}>
          <h1 className="text-lg font-bold" style={{ color: C.dark }}>
            The Plush Stories&trade;
          </h1>
          <p className="text-xs mt-0.5" style={{ color: C.secondary }}>
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3"
              style={{
                background: activeTab === tab.key ? C.subtle : 'transparent',
                color: activeTab === tab.key ? C.primary : C.secondary,
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: C.subtle }}>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setUsername('');
              setPassword('');
            }}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#EF4444' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* main area */}
      <main className="flex-1 min-w-0">
        {/* top bar */}
        <header
          className="sticky top-0 z-20 flex items-center gap-4 px-4 md:px-8 py-4 bg-white shadow-sm border-b"
          style={{ borderColor: C.subtle }}
        >
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: C.dark }}
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold" style={{ color: C.dark }}>
            {tabs.find((t) => t.key === activeTab)?.label}
          </h2>
        </header>

        {/* content */}
        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 border-4 rounded-full animate-spin"
                style={{
                  borderColor: C.subtle,
                  borderTopColor: C.primary,
                }}
              />
            </div>
          ) : (
            <>
              {activeTab === 'products' && <ProductsTab />}
              {activeTab === 'categories' && <CategoriesTab />}
              {activeTab === 'settings' && <SettingsTab />}
              {activeTab === 'quicklinks' && <QuickLinksTab />}
            </>
          )}
        </div>
      </main>

      {/* delete confirmation modal */}
      <DeleteModal />
    </div>
  );
}
