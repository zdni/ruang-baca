import { useCallback, useState } from 'react'
// form
import { useForm } from 'react-hook-form'
// @mui
import { Card, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// utils
import { fData } from '../../utils/formatNumber'
import { changeProfilePictureUser } from '../../helpers/backend_helper'
// components
import FormProvider, { RHFUploadAvatar } from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'

// ----------------------------------------------------------------------

export default function FormUserImage({ user }) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  const [disabledFormEdit, setDisabledFormEdit] = useState(true)

  const defaultValues = {
    id: user?._id || null,
    image: user?.image || '',
    oldImage: user?.image || '',
  }

  const methods = useForm({
    defaultValues,
  })

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    try {
      const response = await changeProfilePictureUser(data.id, data,  { headers: { authorization: `Bearer ${TOKEN}` } })
      if(response.data.status) {
        enqueueSnackbar('Berhasil Mengubah Pengguna!')
      }
      setDisabledFormEdit(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })

      if (file) {
        setValue('image', newFile)
      }
    },
    [setValue]
  )

  const changeDisabledFormEdit = () => { setDisabledFormEdit(false) }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ py: 7, px: 3, textAlign: 'center' }}>
        <RHFUploadAvatar
          name="image"
          maxSize={3145728}
          onDrop={handleDrop}
          helperText={
            <Typography
              variant="caption"
              sx={{
                mt: 2,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              Allowed *.jpeg, *.jpg, *.png
              <br /> max size of {fData(3145728)}
            </Typography>
          }
        />

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          {
            disabledFormEdit &&
            <LoadingButton fullWidth type="submit" variant="contained" onClick={changeDisabledFormEdit}>
              Ubah Profil
            </LoadingButton>
          }
          {
            !disabledFormEdit &&
            <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
              Simpan Perubahan
            </LoadingButton>
          }
        </Stack>
      </Card>
    </FormProvider>
  )
}
