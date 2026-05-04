import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/hooks/use-locale';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({ canManageTwoFactor = false, requiresConfirmation = false, twoFactorEnabled = false }: Props) {
    const { t } = useLocale();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { qrCodeSvg, hasSetupData, manualSetupKey, clearSetupData, clearTwoFactorAuthData, fetchSetupData, recoveryCodesList, fetchRecoveryCodes, errors } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) clearTwoFactorAuthData();
        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title={t('settings_security')} />
            <h1 className="sr-only">{t('settings_security')}</h1>
            <div className="space-y-6">
                <Heading variant="small" title={t('update_password')} description={t('update_password_desc')} />
                <Form {...SecurityController.update.form()} options={{ preserveScroll: true }}
                    resetOnError={['password', 'password_confirmation', 'current_password']}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) passwordInput.current?.focus();
                        if (errors.current_password) currentPasswordInput.current?.focus();
                    }}
                    className="space-y-6">
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">{t('current_password')}</Label>
                                <PasswordInput id="current_password" ref={currentPasswordInput} name="current_password"
                                    className="mt-1 block w-full" autoComplete="current-password" placeholder={t('current_password')} />
                                <InputError message={errors.current_password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('new_password')}</Label>
                                <PasswordInput id="password" ref={passwordInput} name="password"
                                    className="mt-1 block w-full" autoComplete="new-password" placeholder={t('new_password')} />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('confirm_password')}</Label>
                                <PasswordInput id="password_confirmation" name="password_confirmation"
                                    className="mt-1 block w-full" autoComplete="new-password" placeholder={t('confirm_password')} />
                                <InputError message={errors.password_confirmation} />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button disabled={processing} data-test="update-password-button">{t('save_password')}</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {canManageTwoFactor && (
                <div className="space-y-6">
                    <Heading variant="small" title={t('two_factor')} description={t('two_factor_desc')} />
                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <p className="text-sm text-muted-foreground">{t('two_factor_enabled_desc')}</p>
                            <div className="relative inline">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button variant="destructive" type="submit" disabled={processing}>
                                            {t('disable_2fa')}
                                        </Button>
                                    )}
                                </Form>
                            </div>
                            <TwoFactorRecoveryCodes recoveryCodesList={recoveryCodesList} fetchRecoveryCodes={fetchRecoveryCodes} errors={errors} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <p className="text-sm text-muted-foreground">{t('two_factor_disabled_desc')}</p>
                            <div>
                                {hasSetupData ? (
                                    <Button onClick={() => setShowSetupModal(true)}>
                                        <ShieldCheck /> {t('continue_setup')}
                                    </Button>
                                ) : (
                                    <Form {...enable.form()} onSuccess={() => setShowSetupModal(true)}>
                                        {({ processing }) => (
                                            <Button type="submit" disabled={processing}>{t('enable_2fa')}</Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}
                    <TwoFactorSetupModal isOpen={showSetupModal} onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation} twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg} manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData} fetchSetupData={fetchSetupData} errors={errors} />
                </div>
            )}
        </>
    );
}

Security.layout = {
    breadcrumbs: [{ title: 'Security settings', href: edit() }],
};
