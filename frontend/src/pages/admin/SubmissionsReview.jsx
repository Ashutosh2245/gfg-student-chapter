import React, { useEffect, useState } from 'react';
import { tasksAPI } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';
import { FileCheck, ExternalLink, CheckCircle2, XCircle, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SubmissionsReview = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchSubmittedTasks = async () => {
    try {
      const res = await tasksAPI.getTasks({ status: 'SUBMITTED' });
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Error fetching submissions review queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmittedTasks();
  }, []);

  const handleReviewAction = async (action) => {
    if (!selectedTask) return;
    setSubmitting(true);
    setFeedbackMsg('');

    try {
      const res = await tasksAPI.reviewTask(selectedTask.id, {
        action,
        reviewer_comment: reviewComment
      });

      if (res.data.success) {
        setFeedbackMsg(`Task review submitted as ${action}! XP updated accordingly.`);
        setSelectedTask(null);
        setReviewComment('');
        fetchSubmittedTasks();
      }
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || 'Error processing review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <FileCheck className="w-7 h-7 text-amber-400" />
          <span>Task Submissions Review Queue</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Inspect Co-Lead work deliverables, verify proof artifacts, provide constructive feedback, and award XP.
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-gfg-500/10 border border-gfg-500/30 text-gfg-accent text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-300 font-mono uppercase tracking-wider">Submitted Tasks Pending Review</h2>
          
          {loading ? (
            <p className="text-xs text-gray-400 py-8 text-center font-mono">Loading review queue...</p>
          ) : tasks.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center text-gray-400 text-xs">
              🎉 All caught up! No task submissions currently waiting for review.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`bg-dark-card border rounded-2xl p-5 space-y-3 cursor-pointer transition-all ${
                  selectedTask?.id === task.id ? 'border-gfg-accent bg-dark-hover/40 shadow-lg' : 'border-dark-border hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{task.title}</h3>
                  <StatusBadge status={task.status} />
                </div>
                
                <p className="text-xs text-gray-300 line-clamp-2">{task.description}</p>
                
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-2 border-t border-dark-border">
                  <span>Assigned: {task.assignee ? task.assignee.name : 'Unknown'}</span>
                  <span className="text-gfg-accent font-bold">+{task.xp_points} XP</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Task Details & Review Action Box */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-300 font-mono uppercase tracking-wider">Deliverable Inspection</h2>

          {selectedTask ? (
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-gfg-500/10 text-gfg-accent border border-gfg-500/20">
                  {selectedTask.department_name}
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{selectedTask.title}</h3>
                <p className="text-xs text-gray-300 mt-2">{selectedTask.description}</p>
              </div>

              {/* Submission Proof Section */}
              {selectedTask.latest_submission && (
                <div className="bg-dark-bg border border-dark-border rounded-2xl p-4 space-y-3">
                  <span className="text-[11px] font-mono text-gray-400 block font-semibold">SUBMITTED PROOF ARTIFACT</span>
                  <p className="text-xs text-gray-300 italic">"{selectedTask.latest_submission.comment}"</p>
                  
                  {selectedTask.latest_submission.proof_url && (
                    <a
                      href={selectedTask.latest_submission.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-gfg-accent bg-gfg-500/10 border border-gfg-500/30 px-3 py-2 rounded-xl hover:bg-gfg-500/20 transition-colors"
                    >
                      <span>Open Proof Link ({selectedTask.latest_submission.proof_type})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Reviewer Comment Area */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400">Reviewer Feedback Comment</label>
                <textarea
                  rows="3"
                  placeholder="Provide praise or specific requested revisions..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gfg-accent"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => handleReviewAction('APPROVED')}
                  disabled={submitting}
                  className="bg-gfg-500 hover:bg-gfg-hover text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-lg shadow-gfg-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & XP</span>
                </button>

                <button
                  onClick={() => handleReviewAction('REVISION_REQUIRED')}
                  disabled={submitting}
                  className="bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>

                <button
                  onClick={() => handleReviewAction('REJECTED')}
                  disabled={submitting}
                  className="bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-3xl p-12 text-center text-gray-500 text-xs">
              Select a submitted task from the left list to review proof and award XP.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
