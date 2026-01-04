"use client";

import React, { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DeleteDataButtonProps {
    patientId: string;
    onDeleted?: () => void;
}

export default function DeleteDataButton({ patientId, onDeleted }: DeleteDataButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!isConfirming) {
            setIsConfirming(true);
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            // First delete messages
            const { error: messagesError } = await supabase
                .from('messages')
                .delete()
                .eq('patient_id', patientId);

            if (messagesError) throw messagesError;

            // Then delete patient
            const { error: patientError } = await supabase
                .from('patients')
                .delete()
                .eq('id', patientId);

            if (patientError) throw patientError;

            // Success - redirect to showcase
            onDeleted?.();
            window.location.href = '/demo-dashboard';

        } catch (err) {
            console.error('Delete error:', err);
            setError('Silme işlemi başarısız oldu. Lütfen tekrar deneyin.');
            setIsDeleting(false);
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        setIsConfirming(false);
        setError(null);
    };

    if (isConfirming) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-700">Emin misiniz?</h4>
                        <p className="text-sm text-red-600 mt-1">
                            Tüm verileriniz kalıcı olarak silinecek. Bu işlem geri alınamaz.
                        </p>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600 mb-3">{error}</p>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Siliniyor...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Evet, Sil
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
                    >
                        İptal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 transition-colors"
        >
            <Trash2 className="w-4 h-4" />
            Verilerimi Sil
        </button>
    );
}
