'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, X } from 'lucide-react';
import { getAllCourses, deleteCourse, updateCourse, createCourse } from '@/lib/courses';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/constants';
import toast from 'react-hot-toast';
import type { Course } from '@/types';

const EMPTY_COURSE: Omit<Course, 'id' | 'createdAt'> = {
  title:          '',
  slug:           '',
  description:    '',
  category:       'Web Development',
  level:          'Beginner',
  price:          0,
  originalPrice:  0,
  duration:       '',
  lessons:        0,
  students:       0,
  rating:         0,
  instructor:     '',
  instructorBio:  '',
  thumbnail:      '',
  curriculum:     [],
  published:      false,
  tags:           [],
  whatYoullLearn: [],
};

export default function AdminCoursesPage() {
  const [courses,   setCourses]   = useState<Course[]>([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState<Partial<Course> | null>(null);

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadCourses(); }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => { setEditing({ ...EMPTY_COURSE }); setModalOpen(true); };
  const openEdit   = (c: Course) => { setEditing({ ...c }); setModalOpen(true); };

  const handleSave = async () => {
    if (!editing || !editing.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const totalLessons = (editing.curriculum ?? []).reduce((s, m) => s + m.lessons.length, 0);
      const whatYoullLearn = (editing.whatYoullLearn ?? []).filter(Boolean);
      const tags = (editing.tags ?? []).filter(Boolean);

      const data = {
        ...editing,
        slug,
        lessons: totalLessons,
        whatYoullLearn,
        tags,
      } as Omit<Course, 'id' | 'createdAt'>;

      if ((editing as Course).id) {
        await updateCourse((editing as Course).id, data);
        toast.success('Course updated!');
      } else {
        await createCourse(data);
        toast.success('Course created!');
      }
      setModalOpen(false);
      setEditing(null);
      loadCourses();
    } catch { toast.error('Failed to save course.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteCourse(id);
      setCourses(c => c.filter(x => x.id !== id));
      toast.success('Course deleted.');
    } catch { toast.error('Delete failed.'); }
    finally { setDeleting(null); }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await updateCourse(course.id, { published: !course.published });
      setCourses(cs => cs.map(c => c.id === course.id ? { ...c, published: !c.published } : c));
      toast.success(course.published ? 'Course unpublished.' : 'Course published!');
    } catch { toast.error('Update failed.'); }
  };

  // ── Curriculum helpers ───────────────────────────────────────────────────

  const addModule = () => {
    setEditing(d => ({
      ...d,
      curriculum: [...(d?.curriculum ?? []), { moduleTitle: '', lessons: [] }],
    }));
  };

  const removeModule = (mi: number) => {
    setEditing(d => ({
      ...d,
      curriculum: (d?.curriculum ?? []).filter((_, i) => i !== mi),
    }));
  };

  const updateModuleTitle = (mi: number, title: string) => {
    setEditing(d => {
      const curriculum = [...(d?.curriculum ?? [])];
      curriculum[mi] = { ...curriculum[mi], moduleTitle: title };
      return { ...d, curriculum };
    });
  };

  const addLesson = (mi: number) => {
    setEditing(d => {
      const curriculum = [...(d?.curriculum ?? [])];
      curriculum[mi] = {
        ...curriculum[mi],
        lessons: [...curriculum[mi].lessons, { title: '', videoURL: '', duration: '' }],
      };
      return { ...d, curriculum };
    });
  };

  const removeLesson = (mi: number, li: number) => {
    setEditing(d => {
      const curriculum = [...(d?.curriculum ?? [])];
      curriculum[mi] = {
        ...curriculum[mi],
        lessons: curriculum[mi].lessons.filter((_, i) => i !== li),
      };
      return { ...d, curriculum };
    });
  };

  const updateLesson = (mi: number, li: number, field: 'title' | 'videoURL' | 'duration', value: string) => {
    setEditing(d => {
      const curriculum = [...(d?.curriculum ?? [])];
      curriculum[mi] = {
        ...curriculum[mi],
        lessons: curriculum[mi].lessons.map((l, i) =>
          i === li ? { ...l, [field]: value } : l,
        ),
      };
      return { ...d, curriculum };
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-navy-900">Manage Courses</h1>
          <p className="text-gray-500 mt-1 text-sm">
            <span className="font-bold text-navy-900">{courses.length}</span> courses in catalog
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow"
        >
          <Plus size={16} /> Add Course
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
        <Input
          placeholder="Search courses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="h-11"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['Title', 'Category', 'Level', 'Price', 'Students', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="font-bold text-navy-900 text-sm line-clamp-1 group-hover:text-accent-600 transition-colors">{course.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">/{course.slug}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs font-medium">{course.category}</td>
                    <td className="px-5 py-4"><Badge size="sm">{course.level}</Badge></td>
                    <td className="px-5 py-4 font-bold text-navy-900">{formatCurrency(course.price)}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{course.students.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <Badge variant={course.published ? 'success' : 'warning'} size="sm">
                        {course.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-navy-900 transition-colors"
                          title={course.published ? 'Unpublish' : 'Publish'}
                        >
                          {course.published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => openEdit(course)}
                          className="p-2 rounded-xl hover:bg-accent-50 text-gray-400 hover:text-accent-600 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          disabled={deleting === course.id}
                          className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-gray-300" />
          </div>
          <p className="font-display font-bold text-gray-500 text-lg">No courses found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term or add a new course.</p>
        </div>
      )}

      {/* Course Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={(editing as Course)?.id ? 'Edit Course' : 'Add New Course'}
        size="xl"
      >
        {editing && (
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">

            {/* Basic info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Title"
                value={editing.title ?? ''}
                onChange={e => setEditing(d => ({ ...d, title: e.target.value }))}
              />
              <Input
                label="Instructor"
                value={editing.instructor ?? ''}
                onChange={e => setEditing(d => ({ ...d, instructor: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-navy-900 block mb-1.5">Description</label>
              <textarea
                rows={3}
                value={editing.description ?? ''}
                onChange={e => setEditing(d => ({ ...d, description: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-body outline-none focus:border-accent-500 focus:ring-3 focus:ring-accent-500/15 resize-none hover:border-gray-300 transition-colors"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-navy-900 block mb-1.5">Category</label>
                <select
                  value={editing.category ?? 'Web Development'}
                  onChange={e => setEditing(d => ({ ...d, category: e.target.value as Course['category'] }))}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm font-body outline-none focus:border-accent-500 focus:ring-3 focus:ring-accent-500/15 hover:border-gray-300 transition-colors"
                >
                  {COURSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-navy-900 block mb-1.5">Level</label>
                <select
                  value={editing.level ?? 'Beginner'}
                  onChange={e => setEditing(d => ({ ...d, level: e.target.value as Course['level'] }))}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm font-body outline-none focus:border-accent-500 focus:ring-3 focus:ring-accent-500/15 hover:border-gray-300 transition-colors"
                >
                  {COURSE_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <Input
                label="Duration"
                placeholder="e.g. 12 hours"
                value={editing.duration ?? ''}
                onChange={e => setEditing(d => ({ ...d, duration: e.target.value }))}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Price (₦)"
                type="number"
                value={editing.price ?? 0}
                onChange={e => setEditing(d => ({ ...d, price: Number(e.target.value) }))}
              />
              <Input
                label="Original Price (₦) — optional"
                type="number"
                value={editing.originalPrice ?? 0}
                onChange={e => setEditing(d => ({ ...d, originalPrice: Number(e.target.value) }))}
              />
            </div>

            <Input
              label="Instructor Bio"
              value={editing.instructorBio ?? ''}
              onChange={e => setEditing(d => ({ ...d, instructorBio: e.target.value }))}
            />

            <Input
              label="Thumbnail URL — optional"
              placeholder="https://example.com/image.jpg"
              value={editing.thumbnail ?? ''}
              onChange={e => setEditing(d => ({ ...d, thumbnail: e.target.value }))}
            />

            <div>
              <label className="text-sm font-medium text-navy-900 block mb-1.5">
                What You'll Learn — one item per line
              </label>
              <textarea
                rows={4}
                placeholder={'Build REST APIs with Node.js\nUse React hooks effectively\nDeploy to cloud services'}
                value={(editing.whatYoullLearn ?? []).join('\n')}
                onChange={e => setEditing(d => ({
                  ...d,
                  whatYoullLearn: e.target.value.split('\n'),
                }))}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-body outline-none focus:border-accent-500 focus:ring-3 focus:ring-accent-500/15 resize-none hover:border-gray-300 transition-colors"
              />
            </div>

            <Input
              label="Tags — comma separated"
              placeholder="react, typescript, node.js"
              value={(editing.tags ?? []).join(', ')}
              onChange={e => setEditing(d => ({
                ...d,
                tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
              }))}
            />

            {/* Curriculum editor */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-navy-900">Curriculum</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(editing.curriculum ?? []).length} module{(editing.curriculum ?? []).length !== 1 ? 's' : ''} ·{' '}
                    {(editing.curriculum ?? []).reduce((s, m) => s + m.lessons.length, 0)} lessons
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addModule}>
                  <Plus size={13} /> Add Module
                </Button>
              </div>

              <div className="space-y-3">
                {(editing.curriculum ?? []).map((mod, mi) => (
                  <div key={mi} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Module header */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50">
                      <input
                        className="flex-1 text-sm font-semibold text-navy-900 bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal"
                        placeholder={`Module ${mi + 1} title`}
                        value={mod.moduleTitle}
                        onChange={e => updateModuleTitle(mi, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeModule(mi)}
                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        title="Remove module"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Lessons */}
                    <div className="p-3 space-y-2">
                      {mod.lessons.map((lesson, li) => (
                        <div key={li} className="flex items-center gap-2">
                          <input
                            className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20"
                            placeholder="Lesson title"
                            value={lesson.title}
                            onChange={e => updateLesson(mi, li, 'title', e.target.value)}
                          />
                          <input
                            className="w-36 text-xs border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20"
                            placeholder="Video URL"
                            value={lesson.videoURL}
                            onChange={e => updateLesson(mi, li, 'videoURL', e.target.value)}
                          />
                          <input
                            className="w-20 text-xs border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20"
                            placeholder="Duration"
                            value={lesson.duration}
                            onChange={e => updateLesson(mi, li, 'duration', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeLesson(mi, li)}
                            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addLesson(mi)}
                        className="flex items-center gap-1.5 text-xs text-accent-600 hover:text-accent-700 font-semibold mt-1 transition-colors"
                      >
                        <Plus size={12} /> Add Lesson
                      </button>
                    </div>
                  </div>
                ))}

                {(editing.curriculum ?? []).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">
                    No modules yet — click "Add Module" to build your curriculum.
                  </p>
                )}
              </div>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <input
                type="checkbox"
                id="published"
                checked={editing.published ?? false}
                onChange={e => setEditing(d => ({ ...d, published: e.target.checked }))}
                className="accent-accent-500 w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-medium text-navy-900">
                Publish this course immediately
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button loading={saving} onClick={handleSave}>
                {(editing as Course)?.id ? 'Save Changes' : 'Create Course'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
